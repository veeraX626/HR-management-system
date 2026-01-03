import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import engine, SessionLocal, Base
from crud.user import create_user
from schemas.user import UserCreate


async def seed() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:  # type: AsyncSession
        users = [
            UserCreate(username="demo", email="demo@example.com", full_name="Demo User", password="password"),
            UserCreate(username="alex", email="alex@example.com", full_name="Alex Dev", password="password"),
        ]
        for user in users:
            await create_user(session, user)
    print("Seed completed")


if __name__ == "__main__":
    asyncio.run(seed())
