from pydantic import BaseModel

class EmbedRequest(BaseModel):
    message_id: str
    content: str