from fastapi import APIRouter, Request, HTTPException
from app.models.chat import ChatRequest
from app.services.chat import handle_chat


router = APIRouter()

@router.post("/chat")
async def chat(body: ChatRequest, request: Request):
    try: 
        reply = await handle_chat(body.user_id, body.content, request.app.state.pool)
        return reply
    except Exception as e:
        print(f"Chat error: ", e)
        raise HTTPException(status_code=500, detail=str(e))