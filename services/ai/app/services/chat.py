import json
from groq import AsyncGroq
from app.config import settings
from app.services.embedding import embed
from pgvector.asyncpg import register_vector

groq = AsyncGroq(api_key=settings.GROQ_API_KEY)

tools = [
    {
        "type": "function",
        "function": {
            "name": "search_messages", 
            "description": """

            """,
            "parameters": {
                "type": "object",
                "properties": {
                    "query" : {
                        "type": "string",
                        "description": ""
                    }, 
                    "username": {
                        "type": "string"
                    }
                },
                "required": ["query"]
            }
        }
    }, 

    {
        "type": "function",
        "function": {
            "name": "summarize_conversation",
            "description": """
            
            """,
            "parameters": {
                "type": "object",
                "properties": {
                    "username": {
                        "type": "string",
                        "description": ""
                    }, 
                    "start_date": {
                        "type": "string",
                        "description": ""
                    }, 
                    "end_date": {
                        "type": "string",
                        "description": ""
                    }
                },
                "required": ["username"]
            }
        }
    }

]

async def fetch_chat_id(user_id: str, username: str, conn):
    chat = await conn.fetchrow(
                """
                    SELECT dcp1.chat_id
                    FROM direct_chat_participants dcp1
                    JOIN direct_chat_participants dcp2 ON dcp2.chat_id = dcp1.chat_id AND dcp1.user_id = $1
                    JOIN users u ON u.id = dcp2.user_id
                    WHERE dcp2.user_id <> $1
                    AND u.username = $2
                """, 
                user_id, username
            )
    
    if not chat:
        return None
    
    return chat['chat_id']


async def search_messages(user_id: str, username: str | None, query: str, pool):
    embedding = await embed(query)
    async with pool.acquire() as conn:
        await register_vector(conn, schema="extensions")
        
        if username:
            # search based on username - did i every say this to @person / has this @person ever told me this
            chat_id = await fetch_chat_id(user_id, username, conn)

            if not chat_id:
                return {"error": f"No direct chat found with @{username}"}
            
            messages = await conn.fetch(
                """
                    SELECT msg.content, msg.created_at, u.username as sender
                    FROM messages msg
                    JOIN users u ON msg.sender_id = u.id
                    WHERE msg.direct_chat_id = $1 
                    AND msg.embedding IS NOT NULL
                    ORDER BY msg.embedding <=> $2
                    LIMIT 10
                """, 
                chat_id, embedding
            )   

            return [dict(row) for row in messages]
        
        else:
            # global search - did i every say this to anyone / did anyone every say this to me
            messages = await conn.fetch(
                """
                    SELECT msg.content, msg.created_at, u.username as sender
                    FROM messages msg 
                    JOIN users u ON msg.sender_id = u.id
                    WHERE(
                        msg.direct_chat_id IN (
                            SELECT chat_id FROM direct_chat_participants WHERE user_id = $1
                        ) 
                        OR msg.group_id IN (
                            SELECT group_id FROM group_members WHERE user_id = $1
                        )
                    )
                    AND msg.embedding IS NOT NULL
                    ORDER BY msg.embedding <=> $2
                    LIMIT 10
                """,
                user_id, embedding
            )

            return [dict(row) for row in messages]


async def summarize_conversation(user_id: str, username: str, start_date: str | None, end_date: str | None, pool):
    async with pool.acquire() as conn:
        chat_id = await fetch_chat_id(user_id, username, conn)
        if not chat_id:
            return {"error": f"No direct chat found with @{username}"}
        
        query = """
            SELECT msg.content, msg.created_at, u.username as sender
            FROM messages msg
            JOIN users u ON u.id = msg.sender_id
            WHERE msg.direct_chat_id = $1
        """

        params=[chat_id]

        if start_date:
            params.append(start_date)
            query += f" AND msg.created_at >= ${len(params)}"
        if end_date:
            params.append(end_date)
            query += f" AND msg.created_at <= ${len(params)}"

        query += " ORDER BY msg.created_at ASC"

        messages = await conn.fetch(query, *params)
        return [dict(row) for row in messages]


async def handle_chat():
    pass