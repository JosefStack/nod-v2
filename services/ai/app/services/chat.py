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
            Use this tool ONLY when the user is looking for specific messages or wants to know if something was said.
            Do NOT use this for summarizing entire conversations.
            Search through messages semantically. Use when user asks if they every said something or if they every said something to someone specific (based on username). 
            Examples: 
            1) If the user asks, did i ever talk about pets with @patrick? In this explanation @patrick is the user name, and the tool takes patrick (without the @) as the parameter. 
            2) If the user asks, did i ever talk about pets with anyone? In this explanation query will be about pets, and username is not necessary (do not call the tool with username). 

            If the user mentions a name without an @, ask the user to specify the correct username with an @. While calling the function, call without @ in the username.
            If the user's question is not clear, or does not provide a clear hint regarding the parameters, ask the user to clarify. 


            """,
            "parameters": {
                "type": "object",
                "properties": {
                    "query" : {
                        "type": "string",
                        "description": "The search query."
                    }, 
                    "username": {
                        "type": ["string", "null"],
                        "description": "Optional. The username of the person to scope the search to. Do not include @ in the string."
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
            Use this tool ONLY when the user explicitly asks to summarize or get an overview of a conversation. 
            Do NOT use this for searching specific messages.
            Summarize the conversation with a specific person or summarize the conversation with a specific person on a given date range.
            Use when user asks to summarize a conversation or what was discussed with someone particular. 
            Optionally, the conversation can be filtered by a start_date and end_date if the user asks so. 
            Example:
            1) Summarize my conversation with @patrick. @patrick is the username, use patrick for function calling. 
            2) Summarize my conversation with @partick from 2nd of May 2026. Start date is mentioned, call function with username and start date in ISO format e.g. 2026-05-02
            3) Summarize my conversation with @patrick till 2nd of May 2025. Replace start_date with end_date. 
            4) Summarize my conversation with @patrick from 1st January 2026 to 3rd Feb 2026. Include both start_date and end_date.

            If the user's question is not clear, or does not provide a clear hint regarding the parameters, ask the user to clarify. 
            """,
            "parameters": {
                "type": "object",
                "properties": {
                    "username": {
                        "type": "string",
                        "description": "The username of the person whose conversation to summarize. Do not include @ in the string."
                    }, 
                    "start_date": {
                        "type": "string",
                        "description": "Optional. Start date in ISO format e.g. 2026-01-01"
                    }, 
                    "end_date": {
                        "type": "string",
                        "description": "Optional. End date in ISO format e.g. 2026-01-31"
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
                    SELECT dcp1."chatId"
                    FROM direct_chat_participants dcp1
                    JOIN direct_chat_participants dcp2 ON dcp2."chatId" = dcp1."chatId" AND dcp1."userId" = $1
                    JOIN users u ON u.id = dcp2."userId"
                    WHERE dcp2."userId" <> $1
                    AND LOWER(u.username) = $2
                """, 
                user_id, username.lower()
            )
    if not chat:
        return None
    
    print(chat)
    return chat['chatId']


async def fetch_conversations(chat_id, pool):
    async with pool.acquire() as conn:
        messages = await conn.fetch(
            """
                SELECT * FROM (
                    SELECT content, "senderId"
                    FROM messages
                    WHERE "directChatId" = $1
                    AND content IS NOT NULL
                    ORDER BY "createdAt" DESC
                    LIMIT 50
                    ) sub
                ORDER BY "createdAt" ASC
            """, 
            chat_id
        )   

        # fetching using order by desc will generate records like this:
        # [
        #     {last message}
        #     {last message - 1}
        #     ...
        #     {last message - 49}
        # ]

        # but it should be 
        # [
        #     {last message - 49}
        #     ...
        #     {last message}
        # ]

        # so we make it a subquery and then add another order by asc 


        history = []
        for row in messages:
            role = "assistant" if row['senderId'] == settings.BOT_USER_ID else "user"
            history.append({
                "role": role,
                "content": row['content']
            })

        return history



async def search_messages(user_id: str, query: str, pool, username: str | None = None):
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
                    SELECT msg.content, msg."createdAt", u.username as sender
                    FROM messages msg
                    JOIN users u ON msg."senderId" = u.id
                    WHERE msg."directChatId" = $1 
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
                    SELECT msg.content, msg."createdAt", u.username as sender, (
                        SELECT u2.username 
                        FROM direct_chat_participants dcp 
                        JOIN users u2 ON u2.id = dcp."userId"
                        WHERE dcp."chatId" = msg."directChatId" 
                        AND dcp."userId" <> msg."senderId"
                        LIMIT 1
                    ) as receiver
                    FROM messages msg 
                    JOIN users u ON msg."senderId" = u.id
                    WHERE(
                        msg."directChatId" IN (
                            SELECT "chatId" FROM direct_chat_participants WHERE "userId" = $1
                        ) 
                        OR msg."groupId" IN (
                            SELECT "groupId" FROM group_members WHERE "userId" = $1
                        )
                    )
                    AND msg.embedding IS NOT NULL
                    ORDER BY msg.embedding <=> $2
                    LIMIT 10
                """,
                user_id, embedding
            )
            return [dict(row) for row in messages]


async def summarize_conversation(user_id: str, username: str, pool, start_date: str | None = None, end_date: str | None = None):
    async with pool.acquire() as conn:
        chat_id = await fetch_chat_id(user_id, username, conn)
        if not chat_id:
            return {"error": f"No direct chat found with @{username}"}
        
        query = """
            SELECT msg.content, msg."createdAt", u.username as sender
            FROM messages msg
            JOIN users u ON u.id = msg."senderId"
            WHERE msg."directChatId" = $1
        """

        params=[chat_id]

        if start_date:
            params.append(start_date)
            query += f' AND msg."createdAt" >= ${len(params)}'
        if end_date:
            params.append(end_date)
            query += f' AND msg."createdAt" <= ${len(params)}'

        query += ' ORDER BY msg."createdAt" ASC'

        messages = await conn.fetch(query, *params)
        return [dict(row) for row in messages]


available_functions = {
    "search_messages": search_messages,
    "summarize_conversation": summarize_conversation
}

# tc -> tool call
async def execute_tool_call(tc, user_id, pool, messages):
    function_name = tc.function.name
    function_to_call = available_functions.get(function_name)
    function_args = json.loads(tc.function.arguments)
    if function_to_call:
        result = await function_to_call(user_id=user_id, pool=pool, **function_args,)
        messages.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "name": function_name,
            "content": json.dumps(result, default=str)
        })
    else: 
        messages.append({
            "role": "tool",
            "tool_call_id": tc.id,
            "name": function_name,
            "content": "No available function to execute."
        })

async def handle_chat(user_id: str, message: str, chat_id: str, pool):
    history = await fetch_conversations(chat_id, pool)

    systemPrompt = {
            "role": "system",
            "content": """
                You are Nod Bot, a helpful assistant built into the Nod chat app.
                You can search through the user's messages and summarize conversations.
                Always refer to users by their @username. 
                If a user asks you to summarize a conversation with someone, or asks you to search your messages with someone specific, make sure the user is providing the username in @username format. 
                If not, ask the user to clarify and provide the correct username in @username format. 
                When calling tools, do not include @ in the username, only use the username text (excluding @). 

                When presenting search results or summaries, use plain conversational text. 
                Do not use markdown tables, bullet points with pipes, or complex formatting.
                Keep responses concise and natural, as if you're a helpful chat assistant.
                When presenting search results, always mention who the message was sent to or received from.

                Always focus on the user's most recent request. Previous tool results are for context only — do not repeat or default to them.
            """
        }
    
    messages = [
        systemPrompt, 
        *history,
        { "role": "user", "content": message }
    ]

    for msg in messages:
        print(" -->  ", msg)


    while True:
        response = await groq.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=messages,
            tools=tools,
        )

        choice = response.choices[0]
        print(choice.message.tool_calls)
        if choice.finish_reason == "tool_calls":
            messages.append(choice.message)

            for tc in choice.message.tool_calls:
                await execute_tool_call(tc, user_id, pool, messages)

        else:
            return choice.message.content
