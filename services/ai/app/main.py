from fastapi import FastAPI
from app.db.connection import init_pool, close_pool
from contextlib import asynccontextmanager
from app.services.embedding import embed

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_pool(app)
    yield
    await close_pool(app)

app = FastAPI(lifespan=lifespan)


@app.get("/health")
def health():
    return { "status": "ok" }

# @app.get("/test-embed")
# async def test_embed():
#     embedding = await embed("hello world")
#     print(len(embedding))