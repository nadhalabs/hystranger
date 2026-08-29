import asyncio, base64, hashlib, hmac, json, secrets, time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Header, HTTPException, Request, WebSocket, WebSocketDisconnect, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError
from redis.asyncio import Redis

from .config import get_settings
from .database import Base, Report, create_database
from .matchmaking import Match, Matchmaker, ONLINE_KEY
from .models import BlockMessage, ChatMessage, ClientFailureMessage, LeaveMessage, ReportMessage, SignalMessage, client_message_adapter
from .observability import log_event

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.redis_url == "fakeredis://":
        import fakeredis.aioredis
        redis = fakeredis.aioredis.FakeRedis(decode_responses=True)
    else:
        redis = Redis.from_url(settings.redis_url, decode_responses=True)
    engine, session_factory = create_database(settings.database_url)
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    app.state.redis, app.state.database = redis, session_factory
    app.state.matchmaker = Matchmaker(redis, settings.queue_ttl_seconds, settings.match_ttl_seconds, settings.privacy_secret)
    yield
    await engine.dispose()
    await redis.aclose()


app = FastAPI(title="Nadha Relay Signaling", version="0.3.0", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=list(settings.origins), allow_credentials=False,
                   allow_methods=["POST", "GET"], allow_headers=["Content-Type", "Authorization"])


@app.get("/health")
async def health(request: Request) -> dict:
    await request.app.state.redis.ping()
    return {"status": "ok", "environment": settings.app_environment}


@app.get("/api/stats")
async def stats(request: Request) -> dict:
    cutoff = time.time() - 45
    await request.app.state.redis.zremrangebyscore(ONLINE_KEY, "-inf", cutoff)
    return {"online": await request.app.state.redis.zcard(ONLINE_KEY)}


class SessionRequest(BaseModel):
    client_id: str = Field(pattern=r"^[a-f0-9-]{36}$")


@app.post("/api/sessions", status_code=status.HTTP_201_CREATED)
async def create_session(payload: SessionRequest, request: Request) -> dict:
    ip = request.client.host if request.client else "unknown"
    rate_key = f"relay:session-rate:{ip}"
    attempts = await request.app.state.redis.incr(rate_key)
    if attempts == 1:
        await request.app.state.redis.expire(rate_key, settings.session_rate_window_seconds)
    if attempts > settings.session_rate_limit:
        raise HTTPException(status_code=429, detail="Too many session requests")
    session_id = secrets.token_urlsafe(32)
    client_key = f"relay:client-session:{payload.client_id}"
    previous = await request.app.state.redis.get(client_key)
    if previous:
        matchmaker: Matchmaker = request.app.state.matchmaker
        previous_socket = matchmaker.sockets.get(previous)
        if previous_socket:
            await previous_socket.send_json({"type": "session_replaced"})
            await previous_socket.close(code=4001, reason="Opened in another tab")
        await matchmaker.disconnect(previous, "disconnected")
    pipeline = request.app.state.redis.pipeline()
    if previous:
        pipeline.delete(f"relay:session:{previous}")
    pipeline.set(f"relay:session:{session_id}", payload.client_id, ex=settings.session_ttl_seconds, nx=True)
    pipeline.set(client_key, session_id, ex=settings.session_ttl_seconds)
    await pipeline.execute()
    return {"sessionToken": session_id, "expiresIn": settings.session_ttl_seconds}


@app.get("/api/ice-config")
async def ice_config(request: Request, authorization: str | None = Header(default=None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing session")
    token = authorization.removeprefix("Bearer ")
    if not await request.app.state.redis.exists(f"relay:session:{token}"):
        raise HTTPException(status_code=401, detail="Invalid session")
    servers: list[dict] = [{"urls": ["stun:stun.l.google.com:19302"]}]
    if settings.turn_secret and settings.turn_urls:
        expires = int(time.time()) + settings.turn_ttl_seconds
        username = f"{expires}:{secrets.token_hex(6)}"
        digest = hmac.new(settings.turn_secret.encode(), username.encode(), hashlib.sha1).digest()
        servers.append({"urls": settings.turn_urls, "username": username,
                        "credential": base64.b64encode(digest).decode()})
    return {"iceServers": servers, "ttl": settings.turn_ttl_seconds}


def origin_allowed(websocket: WebSocket) -> bool:
    origin = websocket.headers.get("origin")
    return origin in settings.origins or (origin is None and "null" in settings.origins)


async def notify_match(matchmaker: Matchmaker, match: Match) -> None:
    initiator, responder = matchmaker.sockets.get(match.initiator), matchmaker.sockets.get(match.responder)
    if not initiator or not responder:
        await matchmaker.disconnect(match.initiator, "disconnected")
        await matchmaker.disconnect(match.responder, "disconnected")
        return
    await initiator.send_json({"type": "matched", "role": "initiator"})
    await responder.send_json({"type": "matched", "role": "responder"})


async def persist_report(websocket: WebSocket, matchmaker: Matchmaker, token: str, message: ReportMessage) -> bool:
    redis, peer_id = websocket.app.state.redis, await matchmaker.peer_for(token)
    match_id = await matchmaker.match_id_for(token)
    if not peer_id or not match_id:
        await websocket.send_json({"type": "error", "code": "not_matched", "message": "This match has ended."})
        return False
    report_key = f"relay:report-rate:{token}"
    reports = await redis.incr(report_key)
    if reports == 1:
        await redis.expire(report_key, settings.report_rate_window_seconds)
    if reports > settings.report_rate_limit:
        await websocket.send_json({"type": "error", "code": "report_limited", "message": "Report limit reached."})
        return False
    async with websocket.app.state.database() as database:
        database.add(Report(match_reference=matchmaker.reference(match_id),
                            reporter_reference=await matchmaker.identity_for(token) or matchmaker.reference(token),
                            reported_reference=await matchmaker.identity_for(peer_id) or matchmaker.reference(peer_id),
                            reason=message.reason, ended_match=message.end_match))
        await database.commit()
    log_event("report_created", match=matchmaker.reference(match_id), reason=message.reason)
    await websocket.send_json({"type": "report_received"})
    return True


@app.websocket("/ws")
async def signaling_socket(websocket: WebSocket, token: str) -> None:
    if not origin_allowed(websocket):
        await websocket.close(code=1008, reason="Origin not allowed"); return
    redis, matchmaker = websocket.app.state.redis, websocket.app.state.matchmaker
    if not await redis.exists(f"relay:session:{token}"):
        await websocket.close(code=1008, reason="Invalid session"); return
    await websocket.accept()
    existing = matchmaker.sockets.get(token)
    if existing:
        await existing.send_json({"type": "session_replaced"})
        await existing.close(code=4001, reason="Opened in another tab")
    await matchmaker.register(token, websocket)
    log_event("websocket_connect", session=matchmaker.reference(token))
    await websocket.send_json({"type": "ready"})
    rate_key = f"relay:rate:{token}"
    try:
        while True:
            raw_text = await asyncio.wait_for(websocket.receive_text(), timeout=45)
            if len(raw_text.encode()) > settings.websocket_max_bytes:
                await websocket.send_json({"type": "error", "code": "payload_too_large", "message": "That message is too large."}); continue
            try:
                raw = json.loads(raw_text)
            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "code": "invalid_message", "message": "That message was not understood."}); continue
            count = await redis.incr(rate_key)
            if count == 1: await redis.expire(rate_key, settings.message_rate_window_seconds)
            if count > settings.message_rate_limit:
                await websocket.send_json({"type": "error", "code": "rate_limited", "message": "Please slow down."}); continue
            try:
                message = client_message_adapter.validate_python(raw)
            except ValidationError:
                await websocket.send_json({"type": "error", "code": "invalid_message", "message": "That message was not understood."}); continue

            if message.type == "ping":
                await matchmaker.heartbeat(token); await websocket.send_json({"type": "pong", "time": time.time()})
            elif message.type == "join":
                cooldown = await redis.ttl(f"relay:next-cooldown:{token}")
                if cooldown > 0:
                    await websocket.send_json({"type": "cooldown", "seconds": cooldown}); continue
                match = await matchmaker.join(token)
                if match: await notify_match(matchmaker, match)
                else: await websocket.send_json({"type": "searching"})
            elif isinstance(message, LeaveMessage):
                await matchmaker.leave_queue(token); await matchmaker.leave_match(token, message.reason)
                if message.reason == "next":
                    await redis.set(f"relay:next-cooldown:{token}", "1", ex=settings.next_cooldown_seconds)
                await websocket.send_json({"type": "left"})
            elif isinstance(message, BlockMessage):
                await matchmaker.block_peer(token); await matchmaker.leave_match(token, "blocked")
                await websocket.send_json({"type": "blocked"})
            elif isinstance(message, ReportMessage):
                if await persist_report(websocket, matchmaker, token, message) and message.end_match:
                    await matchmaker.leave_match(token, "reported")
            elif isinstance(message, ClientFailureMessage):
                log_event("webrtc_failure", session=matchmaker.reference(token), category=message.category)
            elif isinstance(message, (SignalMessage, ChatMessage)):
                peer_id = await matchmaker.peer_for(token)
                peer = matchmaker.sockets.get(peer_id) if peer_id else None
                if not peer:
                    await websocket.send_json({"type": "error", "code": "not_matched", "message": "You are not in a match."}); continue
                if isinstance(message, ChatMessage):
                    text = message.text.strip()
                    if not text or len(text) > settings.max_text_length:
                        await websocket.send_json({"type": "error", "code": "invalid_chat", "message": "Message is empty or too long."}); continue
                    await peer.send_json({"type": "chat", "text": text, "sentAt": time.time()})
                else:
                    await peer.send_json({"type": "signal", "signalType": message.signal_type, "payload": message.payload})
    except asyncio.TimeoutError:
        await websocket.close(code=1001, reason="Heartbeat timeout")
    except WebSocketDisconnect:
        pass
    except Exception as error:
        log_event("signaling_failure", session=matchmaker.reference(token), error=type(error).__name__)
    finally:
        if matchmaker.sockets.get(token) is websocket:
            await matchmaker.unregister(token)
            log_event("websocket_disconnect", session=matchmaker.reference(token))
