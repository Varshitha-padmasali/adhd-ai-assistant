from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.post("/chat")
def chat():
    return {"reply": "AI response will come here"}