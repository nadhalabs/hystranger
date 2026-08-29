from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    redis_url: str = "redis://localhost:6379/0"
    allowed_origins: str = "http://localhost:3000"
    session_ttl_seconds: int = 86_400
    queue_ttl_seconds: int = 45
    match_ttl_seconds: int = 3_600
    message_rate_limit: int = 60
    message_rate_window_seconds: int = 10
    max_text_length: int = 500
    database_url: str = "sqlite+aiosqlite:///./nadha_relay.db"
    app_environment: str = "development"
    privacy_secret: str = "change-me-in-production"
    turn_secret: str = ""
    turn_host: str = ""
    turn_ttl_seconds: int = 3_600
    turn_port: int = 3478
    turn_tls_port: int = 5349
    websocket_max_bytes: int = 16_384
    session_rate_limit: int = 20
    session_rate_window_seconds: int = 60
    next_cooldown_seconds: int = 2
    report_rate_limit: int = 5
    report_rate_window_seconds: int = 3_600
    block_ttl_seconds: int = 2_592_000

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def origins(self) -> set[str]:
        return {origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()}

    @property
    def turn_urls(self) -> list[str]:
        if not self.turn_host:
            return []
        return [
            f"turn:{self.turn_host}:{self.turn_port}?transport=udp",
            f"turn:{self.turn_host}:{self.turn_port}?transport=tcp",
            f"turns:{self.turn_host}:{self.turn_tls_port}?transport=tcp",
        ]


@lru_cache
def get_settings() -> Settings:
    return Settings()
