import asyncio
import asyncpg
from pgvector.asyncpg import register_vector
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


from app.config import settings
from app.services.embedding import embed


async def backfill():
    conn = await asyncpg.connect(settings.DATABASE_URL)
    await register_vector(conn, schema="extensions")
    
    try:
        messages = await conn.fetch(
            "SELECT id, content FROM messages WHERE embedding IS NULL AND content IS NOT NULL"
        )
        
        print(f"Found {len(messages)} messages to embed")
        
        for msg in messages:
            embedding = await embed(msg['content'])
            await conn.execute(
                "UPDATE messages SET embedding = $1 WHERE id = $2",
                embedding, msg['id']
            )
            print(f"Embedded message {msg['id']}")
        
        print("Backfill complete")
    
    except Exception as e:
        print(f"Backfill failed: {e}")
        raise
    
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(backfill())