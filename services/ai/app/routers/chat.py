from fastapi import APIRouter, Request, HTTPException
from app.models.chat import ChatRequest



router = APIRouter()

@router.post("/chat")
async def chat(body: ChatRequest, request: Request):
    try: 
        pass
    except Exception as e:
        print(f"Chat error: ", e)
        raise HTTPException(status_code=500, detail=str(e))