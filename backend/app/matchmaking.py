import asyncio
import hashlib
import hmac
import json
import secrets
import time
from dataclasses import dataclass
from typing import Protocol

from redis.asyncio import Redis
from .observability import log_event


QUEUE_KEY = "relay:waiting"
QUEUED_KEY = "relay:queued"
ONLINE_KEY = "relay:online"


class SocketLike(Protocol):
    async def send_json(self, data: dict) -> None: ...
    async def close(self, code: int = 1000, reason: str | None = None) -> None: ...


@dataclass(frozen=True)
class Match:
    match_id: str
    initiator: str
    responder: str


class Matchmaker:
    def __init__(self, redis: Redis, queue_ttl: int = 45, match_ttl: int = 3600, privacy_secret: str = ""):
        self.redis = redis
        self.queue_ttl = queue_ttl
        self.match_ttl = match_ttl
        self.privacy_secret = privacy_secret.encode()
        self.sockets: dict[str, SocketLike] = {}
        self._lock = asyncio.Lock()

    async def register(self, session_id: str, socket: SocketLike) -> None:
        self.sockets[session_id] = socket
        await self.redis.zadd(ONLINE_KEY, {session_id: time.time()})

    async def unregister(self, session_id: str) -> None:
        self.sockets.pop(session_id, None)
        await self.redis.zrem(ONLINE_KEY, session_id)
        await self.disconnect(session_id, "disconnected")

    async def join(self, session_id: str) -> Match | None:
        async with self._lock:
            if await self.redis.get(f"relay:user-match:{session_id}"):
                return None
            if await self.redis.sismember(QUEUED_KEY, session_id):
                await self.redis.set(f"relay:queue-alive:{session_id}", "1", ex=self.queue_ttl)
                return None

            await self._purge_stale_locked()
            opponent = await self._pop_available_locked(session_id)
            if opponent:
                return await self._create_match_locked(opponent, session_id)

            pipeline = self.redis.pipeline()
            pipeline.rpush(QUEUE_KEY, session_id)
            pipeline.sadd(QUEUED_KEY, session_id)
            pipeline.set(f"relay:queue-alive:{session_id}", "1", ex=self.queue_ttl)
            await pipeline.execute()
            log_event("queue_join", session=self.reference(session_id))
            return None

    async def heartbeat(self, session_id: str) -> None:
        await self.redis.zadd(ONLINE_KEY, {session_id: time.time()})
        if await self.redis.sismember(QUEUED_KEY, session_id):
            await self.redis.set(f"relay:queue-alive:{session_id}", "1", ex=self.queue_ttl)

    async def leave_queue(self, session_id: str) -> None:
        pipeline = self.redis.pipeline()
        pipeline.lrem(QUEUE_KEY, 0, session_id)
        pipeline.srem(QUEUED_KEY, session_id)
        pipeline.delete(f"relay:queue-alive:{session_id}")
        await pipeline.execute()

    async def leave_match(self, session_id: str, reason: str) -> str | None:
        async with self._lock:
            match_id_raw = await self.redis.get(f"relay:user-match:{session_id}")
            if not match_id_raw:
                return None
            match_id = self._decode(match_id_raw)
            raw = await self.redis.get(f"relay:match:{match_id}")
            if not raw:
                await self.redis.delete(f"relay:user-match:{session_id}")
                return None
            data = json.loads(self._decode(raw))
            peer_id = data["responder"] if data["initiator"] == session_id else data["initiator"]
            pipeline = self.redis.pipeline()
            pipeline.delete(f"relay:match:{match_id}")
            pipeline.delete(f"relay:user-match:{session_id}", f"relay:user-match:{peer_id}")
            await pipeline.execute()

        peer_socket = self.sockets.get(peer_id)
        if peer_socket:
            await peer_socket.send_json({"type": "peer_left", "reason": reason})
        log_event("match_ended", match=self.reference(match_id), reason=reason)
        return peer_id

    async def disconnect(self, session_id: str, reason: str) -> None:
        await self.leave_queue(session_id)
        await self.leave_match(session_id, reason)

    async def block_peer(self, session_id: str) -> str | None:
        peer_id = await self.peer_for(session_id)
        if not peer_id:
            return None
        blocker, blocked = await self.identity_for(session_id), await self.identity_for(peer_id)
        if blocker and blocked:
            key = f"relay:blocked:{blocker}"
            await self.redis.sadd(key, blocked)
            await self.redis.expire(key, 2_592_000)
        return peer_id

    async def identity_for(self, session_id: str) -> str | None:
        client_id = await self.redis.get(f"relay:session:{session_id}")
        return self.reference(self._decode(client_id)) if client_id else None

    async def is_blocked_pair(self, first: str, second: str) -> bool:
        first_id, second_id = await self.identity_for(first), await self.identity_for(second)
        if not first_id or not second_id:
            return False
        return bool(
            await self.redis.sismember(f"relay:blocked:{first_id}", second_id)
            or await self.redis.sismember(f"relay:blocked:{second_id}", first_id)
        )

    async def peer_for(self, session_id: str) -> str | None:
        match_id_raw = await self.redis.get(f"relay:user-match:{session_id}")
        if not match_id_raw:
            return None
        raw = await self.redis.get(f"relay:match:{self._decode(match_id_raw)}")
        if not raw:
            return None
        data = json.loads(self._decode(raw))
        return data["responder"] if data["initiator"] == session_id else data["initiator"]

    async def match_id_for(self, session_id: str) -> str | None:
        value = await self.redis.get(f"relay:user-match:{session_id}")
        return self._decode(value) if value else None

    async def _pop_available_locked(self, joining_id: str) -> str | None:
        while True:
            raw = await self.redis.lpop(QUEUE_KEY)
            if not raw:
                return None
            candidate = self._decode(raw)
            await self.redis.srem(QUEUED_KEY, candidate)
            if candidate == joining_id:
                continue
            if not await self.redis.exists(f"relay:queue-alive:{candidate}"):
                continue
            if candidate not in self.sockets:
                continue
            if await self.redis.get(f"relay:user-match:{candidate}"):
                continue
            if await self.is_blocked_pair(candidate, joining_id):
                await self.redis.rpush(QUEUE_KEY, candidate)
                await self.redis.sadd(QUEUED_KEY, candidate)
                return None
            await self.redis.delete(f"relay:queue-alive:{candidate}")
            return candidate

    async def _create_match_locked(self, initiator: str, responder: str) -> Match:
        match = Match(secrets.token_urlsafe(18), initiator, responder)
        payload = json.dumps({"initiator": initiator, "responder": responder, "created_at": time.time()})
        pipeline = self.redis.pipeline()
        pipeline.set(f"relay:match:{match.match_id}", payload, ex=self.match_ttl)
        pipeline.set(f"relay:user-match:{initiator}", match.match_id, ex=self.match_ttl)
        pipeline.set(f"relay:user-match:{responder}", match.match_id, ex=self.match_ttl)
        await pipeline.execute()
        log_event("match_created", match=self.reference(match.match_id))
        return match

    async def _purge_stale_locked(self) -> None:
        members = await self.redis.smembers(QUEUED_KEY)
        for raw in members:
            session_id = self._decode(raw)
            if not await self.redis.exists(f"relay:queue-alive:{session_id}") or session_id not in self.sockets:
                await self.leave_queue(session_id)

    @staticmethod
    def _decode(value: bytes | str) -> str:
        return value.decode() if isinstance(value, bytes) else value

    def reference(self, value: str) -> str:
        return hmac.new(self.privacy_secret, value.encode(), hashlib.sha256).hexdigest()[:24]
