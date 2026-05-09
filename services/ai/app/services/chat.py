import json
from groq import AsyncGroq
from app.config import settings
from app.services.embedding import embed
from pgvector.asyncpg import register_vector

groq = AsyncGroq(api_key=settings.GROQ_API_KEY)



async def search_messages(user_id: str, chat_id: str, query: str, pool):
    embeddings = await embed(query)
    async with pool.acquire() as conn:
        await register_vector(conn, schema="extensions")
        