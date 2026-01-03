from functools import lru_cache
from typing import List
from pydantic import BaseModel
from pydantic import Field


class Settings(BaseModel):
    database_url: str = Field(..., alias="DATABASE_URL")
    jwt_secret: str = Field(..., alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    access_token_expire_minutes: int = Field(default=60, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    cors_origins: List[str] = Field(default_factory=list, alias="CORS_ORIGINS")

    class Config:
        populate_by_name = True


@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]
