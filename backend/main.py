import asyncio
import json
from pathlib import Path
from typing import List
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from config import get_settings
from database import Base, engine, get_db
from routers import auth, users

settings = get_settings()
app = FastAPI(title="Hackathon Starter API", version="0.1.0")

origins: List[str] = [origin.strip() for origin in settings.cors_origins]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"], dependencies=[Depends(get_db)])


@app.get("/health", tags=["health"])
async def health() -> dict:
    return {"status": "ok"}


@app.get("/mock/users", tags=["mock"])
async def mock_users() -> list:
    mock_path = Path(__file__).parent / "mock_data" / "users.json"
    with mock_path.open() as f:
        return json.load(f)


async def init_models() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


@app.on_event("startup")
async def on_startup() -> None:
    await init_models()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
