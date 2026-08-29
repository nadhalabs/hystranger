import fakeredis.aioredis
import pytest

from app.matchmaking import Matchmaker


class FakeSocket:
    def __init__(self):
        self.messages: list[dict] = []

    async def send_json(self, data: dict) -> None:
        self.messages.append(data)

    async def close(self, code: int = 1000, reason: str | None = None) -> None:
        return None


@pytest.fixture
async def redis_client():
    client = fakeredis.aioredis.FakeRedis(decode_responses=True)
    yield client
    await client.aclose()


@pytest.fixture
def fake_socket():
    return FakeSocket


@pytest.fixture
def matchmaker(redis_client):
    return Matchmaker(redis_client, queue_ttl=10, match_ttl=100)
