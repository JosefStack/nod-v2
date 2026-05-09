from fastapi import APIRouter, Request, HTTPException
from app.models.embed import EmbedRequest
from app.services.embedding import embed
from pgvector.asyncpg import register_vector


router = APIRouter()

@router.post("/embed")
async def embed_message(body: EmbedRequest, request: Request):
    try:
        embedding = await embed(body.content)

        async with request.app.state.pool.acquire() as conn:
            await register_vector(conn, schema="extensions")

            result = await conn.execute(
                "UPDATE messages SET embedding = $1 WHERE id = $2", 
                embedding, body.message_id
            )

            if result == "UPDATE 0":
                raise HTTPException(status_code=404, detail="message not found") 

        return { "success": True }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="error embedding message")
