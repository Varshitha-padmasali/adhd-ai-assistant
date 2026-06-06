from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
from typing import List, Literal

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]

SYSTEM_PROMPT = """
You are an ADHD-friendly AI learning assistant.
    
Rules:
- Use simple language.
- Keep explanations short.
- Break concepts into small chunks.
- Use bullet points.
- Give examples.
- Avoid overwhelming information.
- Encourage the student gently.
"""
@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/chat")
def chat(request: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="Gemini API key is not configured.",
        )

    if not request.messages:
        raise HTTPException(
            status_code=400,
            detail="At least one message is required.",
        )

    conversation = "\n".join(
        f"{'Student' if message.role == 'user' else 'Assistant'}: {message.content}"
        for message in request.messages
        if message.content.strip()
    )

    if not conversation:
        raise HTTPException(
            status_code=400,
            detail="Message content cannot be empty.",
        )

    prompt = f"""
    {SYSTEM_PROMPT}

    Conversation so far:
    {conversation}

    Continue the conversation as the assistant.
    """

    try:
        response = model.generate_content(prompt)
    except Exception as error:
        raise HTTPException(
            status_code=502,
            detail="Unable to get a response from Gemini right now.",
        ) from error

    if not response.text:
        raise HTTPException(
            status_code=502,
            detail="Gemini returned an empty response.",
        )

    return {
        "reply": response.text
    }
