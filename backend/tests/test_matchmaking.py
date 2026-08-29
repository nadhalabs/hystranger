import json

from app.matchmaking import QUEUED_KEY, QUEUE_KEY


async def test_queue_pairing(matchmaker, fake_socket):
    await matchmaker.register("a", fake_socket())
    await matchmaker.register("b", fake_socket())
    assert await matchmaker.join("a") is None
    match = await matchmaker.join("b")
    assert match is not None
    assert {match.initiator, match.responder} == {"a", "b"}
    assert await matchmaker.peer_for("a") == "b"
    assert await matchmaker.peer_for("b") == "a"


async def test_duplicate_queue_join_is_idempotent(matchmaker, redis_client, fake_socket):
    await matchmaker.register("a", fake_socket())
    await matchmaker.join("a")
    await matchmaker.join("a")
    assert await redis_client.llen(QUEUE_KEY) == 1
    assert await redis_client.scard(QUEUED_KEY) == 1


async def test_disconnect_removes_queue_entry(matchmaker, redis_client, fake_socket):
    await matchmaker.register("a", fake_socket())
    await matchmaker.join("a")
    await matchmaker.unregister("a")
    assert await redis_client.llen(QUEUE_KEY) == 0
    assert not await redis_client.sismember(QUEUED_KEY, "a")


async def test_next_cleans_match_and_notifies_peer(matchmaker, redis_client, fake_socket):
    socket_a, socket_b = fake_socket(), fake_socket()
    await matchmaker.register("a", socket_a)
    await matchmaker.register("b", socket_b)
    await matchmaker.join("a")
    match = await matchmaker.join("b")
    assert match
    await matchmaker.leave_match("a", "next")
    assert await matchmaker.peer_for("b") is None
    assert socket_b.messages[-1] == {"type": "peer_left", "reason": "next"}
    assert not await redis_client.exists(f"relay:match:{match.match_id}")


async def test_match_cleanup_on_disconnect(matchmaker, redis_client, fake_socket):
    socket_a, socket_b = fake_socket(), fake_socket()
    await matchmaker.register("a", socket_a)
    await matchmaker.register("b", socket_b)
    await matchmaker.join("a")
    match = await matchmaker.join("b")
    assert match
    await matchmaker.unregister("b")
    assert not await redis_client.exists(f"relay:user-match:a")
    assert socket_a.messages[-1]["type"] == "peer_left"


async def test_stale_queue_entries_are_skipped(matchmaker, redis_client, fake_socket):
    await redis_client.rpush(QUEUE_KEY, "ghost")
    await redis_client.sadd(QUEUED_KEY, "ghost")
    await matchmaker.register("a", fake_socket())
    assert await matchmaker.join("a") is None
    assert await redis_client.lrange(QUEUE_KEY, 0, -1) == ["a"]


async def test_match_metadata_is_server_generated(matchmaker, redis_client, fake_socket):
    await matchmaker.register("a", fake_socket())
    await matchmaker.register("b", fake_socket())
    await matchmaker.join("a")
    match = await matchmaker.join("b")
    raw = await redis_client.get(f"relay:match:{match.match_id}")
    data = json.loads(raw)
    assert data["initiator"] == "a"
    assert data["responder"] == "b"
