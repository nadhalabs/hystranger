# Nadha Relay architecture and protocol

## Frontend routes

- `/` — responsive landing, interests, real presence count, and first-use safety acknowledgement.
- `/video` — media preparation followed by searching, WebRTC conversation, text chat, report/block, Next, and Stop states.
- `/text` — Phase 1 placeholder; text inside an active video match is fully functional.
- `/about`, `/privacy`, `/terms` — supporting product pages.

## HTTP API

- `GET /health` — Redis-backed service health and environment.
- `GET /api/stats` — approximate active WebSocket count after pruning stale presence.
- `POST /api/sessions` — rate-limited anonymous session creation/rotation. Body: `{client_id}`.
- `GET /api/ice-config` — authenticated STUN/TURN configuration with time-limited HMAC credentials.

## WebSocket protocol

Connect to `/ws?token=<server-issued-token>` from an allowed origin. Client messages are `join`, `leave`, `signal`, `chat`, `ping`, `report`, `block`, and `client_failure`. Server messages are `ready`, `searching`, `cooldown`, `matched`, `signal`, `chat`, `peer_left`, `left`, `report_received`, `blocked`, `pong`, and a validated `error`. Match IDs and peer session IDs are never sent to or selected by clients.

SDP/ICE payloads are relayed only to the server-selected peer. Chat text is relayed in memory and is not persisted or logged. Payloads larger than 16 KiB are rejected before validation.

## Redis state

- `relay:session:<token>` — browser-generated non-fingerprinting client UUID; 24-hour TTL.
- `relay:client-session:<client UUID>` — current token used to suppress uncontrolled duplicate tabs; 24-hour TTL.
- `relay:waiting` — FIFO queue list.
- `relay:queued` — queue-membership set preventing duplicate positions.
- `relay:queue-alive:<token>` — heartbeat marker with a short TTL.
- `relay:match:<server match ID>` — initiator/responder metadata with one-hour TTL.
- `relay:user-match:<token>` — single-match guard with one-hour TTL.
- `relay:online` — sorted-set heartbeat presence; entries older than 45 seconds are pruned.
- `relay:blocked:<HMAC browser reference>` — pseudonymous recent-block set with a 30-day TTL.
- `relay:rate:*`, `relay:session-rate:*`, `relay:report-rate:*`, `relay:next-cooldown:*` — short-lived abuse controls.

All Redis state is ephemeral and can be discarded. A single FastAPI worker owns live WebSocket objects; before horizontal backend scaling, add Redis Pub/Sub for cross-process delivery and replace the process lock with a distributed/atomic pairing operation.

## PostgreSQL model

`reports` stores a random report ID, HMAC match/reporter/reported references, an enumerated reason, whether the report ended the match, and a timestamp. It stores no chat text, SDP, ICE candidates, IP address, media, screenshot, or recording.

## WebRTC lifecycle

The camera/microphone stream is created during preparation and retained across matches. After server pairing, the initiator creates an offer, the responder answers, and both queue ICE candidates until the remote description exists. The peer connection uses backend-supplied STUN/TURN configuration. A six-second disconnected grace period allows transient network recovery; failed connections and 18-second setup timeouts dispose the peer and emit content-free operational telemetry. `Next` closes only the peer connection and requeues while retaining local tracks. `Stop` closes signaling, disposes the peer, stops every local track, and returns home.
