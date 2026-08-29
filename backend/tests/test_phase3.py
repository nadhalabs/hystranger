from sqlalchemy import func, select

from app.config import Settings
from app.database import Base, Report, create_database
from app.matchmaking import ONLINE_KEY


async def test_presence_tracks_connected_sockets(matchmaker, redis_client, fake_socket):
    await matchmaker.register("a", fake_socket())
    await matchmaker.register("b", fake_socket())
    assert await redis_client.zcard(ONLINE_KEY) == 2
    await matchmaker.unregister("a")
    assert await redis_client.zcard(ONLINE_KEY) == 1


async def test_blocked_identites_are_not_eligible_for_rematch(matchmaker, redis_client, fake_socket):
    await redis_client.set("relay:session:a", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa")
    await redis_client.set("relay:session:b", "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb")
    await matchmaker.register("a", fake_socket())
    await matchmaker.register("b", fake_socket())
    await matchmaker.join("a")
    assert await matchmaker.join("b") is not None
    await matchmaker.block_peer("a")
    assert await matchmaker.is_blocked_pair("a", "b")
    blocker = await matchmaker.identity_for("a")
    assert await redis_client.ttl(f"relay:blocked:{blocker}") > 0


def test_turn_urls_cover_udp_tcp_and_tls():
    settings = Settings(turn_host="turn.example.com", turn_port=3478, turn_tls_port=5349)
    assert settings.turn_urls == [
        "turn:turn.example.com:3478?transport=udp",
        "turn:turn.example.com:3478?transport=tcp",
        "turns:turn.example.com:5349?transport=tcp",
    ]


async def test_report_model_persists_only_moderation_metadata(tmp_path):
    engine, factory = create_database(f"sqlite+aiosqlite:///{tmp_path}/reports.db")
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with factory() as database:
        database.add(Report(match_reference="match", reporter_reference="one", reported_reference="two", reason="spam", ended_match=True))
        await database.commit()
        count = await database.scalar(select(func.count()).select_from(Report))
    await engine.dispose()
    assert count == 1
    assert not hasattr(Report, "video")
    assert not hasattr(Report, "chat_body")
