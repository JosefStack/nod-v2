import voyageai
from app.config import settings

client = voyageai.AsyncClient(api_key=settings.VOYAGE_API_KEY)

async def embed(text: str) -> list[float]:
    try:
        result = await client.embed(
            texts=[text],
            model="voyage-4-lite",
        )
        return result.embeddings[0]
    except Exception as e:
        print(f"Embedding failed: {e}")
        raise
