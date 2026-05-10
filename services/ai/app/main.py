from fastapi import FastAPI
from app.db.connection import init_pool, close_pool
from contextlib import asynccontextmanager
from app.services.embedding import embed
from app.routers.embed import router as embed_router
from app.routers.chat import router as chat_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_pool(app)
    yield
    await close_pool(app)

app = FastAPI(lifespan=lifespan)
app.include_router(embed_router)
app.include_router(chat_router)

@app.get("/health", include_in_schema=False)
@app.head("/health", include_in_schema=False)
def health():
    return { "status": "ok" }

# @app.get("/test-embed")
# async def test_embed():
#     embedding = await embed("hello world")
#     print(len(embedding))