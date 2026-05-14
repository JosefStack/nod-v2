import voyageai
# from app.config import settings
from dotenv import load_dotenv
import asyncio
import os
load_dotenv()

client = voyageai.AsyncClient(api_key=os.getenv("VOYAGE_API_KEY"))

async def rerank(query, chunks):
    ranks = await client.rerank(query, chunks, model="rerank-2.5")
    return [(rank.index, rank.relevance_score) for rank in ranks.results]


async def main():
    query = "what is my name?"
    chunks = [
        "my name is bek",
        "his name is keb"
    ]

    await rerank(query, chunks)


asyncio.run(main())
