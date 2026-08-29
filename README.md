# Nadha Relay

Anonymous one-to-one video and text conversations built with Next.js, FastAPI, Redis, WebSockets, and WebRTC.

## Local development

1. Copy `.env.example` to `.env.local` and `backend/.env.example` to `backend/.env`.
2. Start Redis on `localhost:6379` (or run `docker compose up redis`).
3. Install and start the signaling service:

   ```bash
   python3 -m venv backend/.venv
   backend/.venv/bin/pip install -r backend/requirements.txt
   cd backend && .venv/bin/uvicorn app.main:app --reload
   ```

4. Install and start the frontend in another terminal:

   ```bash
   npm install
   npm run dev
   ```

Open `http://localhost:3000`. Camera access requires localhost or HTTPS.

## Configuration

- `NEXT_PUBLIC_SIGNALING_URL` points the browser to FastAPI.
- `NEXT_PUBLIC_ICE_SERVERS` accepts a JSON array of standard `RTCIceServer` objects. The default is a public STUN server. Add production TURN credentials here without changing frontend code.
- `REDIS_URL` selects Redis for queue, match, session, and rate-limit state.
- `ALLOWED_ORIGINS` is a comma-separated WebSocket/HTTP origin allowlist.

Media never passes through FastAPI. FastAPI relays only SDP, ICE candidates, and ephemeral chat messages; WebRTC carries audio/video directly between peers when network conditions allow.

## Verification

```bash
cd backend && .venv/bin/python -m pytest -q
npm run lint
npm run typecheck
npm run build
```

The included Docker Compose file starts Redis and the signaling service. The frontend can be deployed independently as a standard Next.js application.
