from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    openclaw_gateway_url: str = "http://localhost:8080"
    openclaw_api_key: str = ""
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()
