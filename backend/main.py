from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import os
from typing import List

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

class ChatRequest(BaseModel):
    message: str

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

    prompt = f"""
    {SYSTEM_PROMPT}

    Student:
    {request.message}
    """

    response = model.generate_content(prompt)

    return {
        "reply": response.text
    }
