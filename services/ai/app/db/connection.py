import asyncpg
from app.config import settings

async def init_pool(app):
    try:
        app.state.pool = await asyncpg.create_pool(settings.DATABASE_URL)
        print(" --> Database pool created successfully <-- ")
    except Exception as e:
        print(f"Failed to create databse pool: {e}")
        raise

async def close_pool(app):
    await app.state.pool.close()
    print(" --> Database pool closed <-- ")
