# Nadha Relay deployment

## Architecture

Vercel serves the Next.js frontend. A Linux VPS runs one FastAPI WebSocket process behind Nginx, Redis stores ephemeral sessions/queues/matches/rate limits, PostgreSQL stores reports, and Coturn runs on a public-IP VPS. Audio and video remain browser-to-browser; Coturn relays encrypted WebRTC packets only when direct connectivity fails.

## Frontend

Deploy the repository to Vercel and set `NEXT_PUBLIC_SIGNALING_URL=https://api.example.com`. The ICE fallback variable should contain STUN only. TURN credentials come from the authenticated backend endpoint and must never be placed in Vercel public variables.

## FastAPI, Redis, and PostgreSQL

Create `/etc/nadha-relay/backend.env` from `backend/.env.example`. Use long independent values for `PRIVACY_SECRET`, database credentials, and `TURN_SECRET`. Install the provided systemd unit and Nginx configuration, add a trusted TLS certificate, then enable the service. The initial deployment intentionally uses one Uvicorn worker because sockets are process-local; Redis Pub/Sub is required before adding workers or backend replicas.

Use a managed PostgreSQL service with encrypted backups where possible. The application creates the initial report table; introduce Alembic migrations before evolving the schema. Redis can initially run locally with persistence disabled because all its data is ephemeral.

## Coturn

1. Create `turn.example.com` pointing directly to a public VPS.
2. Install Coturn and copy `infra/coturn/turnserver.conf.example` to the system configuration.
3. Set `static-auth-secret` to the exact `TURN_SECRET` used by FastAPI.
4. Install a trusted certificate for TURN TLS.
5. Open TCP/UDP 3478, TCP 5349, and UDP 49160–49200.
6. Set `TURN_HOST=turn.example.com`. FastAPI will return UDP, TCP, and TLS URLs with HMAC credentials that expire after `TURN_TTL_SECONDS`.

Verify UDP, TCP, and TLS relay candidates independently with the Trickle ICE test before launch. Do not log the credential response.

## Local and device testing

`docker compose up -d redis postgres`, start FastAPI, then run `npm run dev`. Separate browsers or an incognito window emulate two anonymous devices. Duplicate normal tabs intentionally rotate the same browser identity.

Camera access works over plain HTTP only on localhost. For a second phone or computer on the LAN, expose both frontend and API using trusted HTTPS (for example a local trusted certificate or an HTTPS tunnel), set `ALLOWED_ORIGINS` to the exact frontend origin, and point `NEXT_PUBLIC_SIGNALING_URL` at the HTTPS API. Never bypass browser certificate warnings for camera testing.

## Monitoring

Ship stdout JSON logs to the VPS journal or a log collector. Alert on health endpoint failure, elevated `signaling_failure`/`webrtc_failure`, Redis/PostgreSQL connectivity, report volume spikes, and TURN bandwidth. Logs intentionally contain pseudonymous truncated HMAC references and never chat bodies, SDP, ICE payloads, media, or TURN credentials.
