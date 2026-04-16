import asyncio
import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 🔐 Setup
load_dotenv()
DB_FILE = "database.json"

app = FastAPI(title="Nexus IT Central API")

# 🛡️ CORS Middleware (Critical for local React development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 📁 Database Logic ---

def get_db():
    try:
        if not os.path.exists(DB_FILE):
            default_db = {"users": [], "logs": []}
            with open(DB_FILE, "w") as f: json.dump(default_db, f)
        with open(DB_FILE, "r") as f:
            data = json.load(f)
            # Migration/Normalization: Ensure keys exist
            if not isinstance(data, dict): data = {"users": [], "logs": []}
            return data
    except Exception:
        return {"users": [], "logs": []}

def save_db(data):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

# --- 🛰️ Models ---

class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    role: str
    status: str = "Active"
    dept: str = "Security Operations"

class Log(BaseModel):
    id: Optional[int] = None
    date: str
    time: str
    action: str
    target: str
    actor: str = "System"
    status: str = "SUCCESS"

# --- 🛰️ API Endpoints ---

@app.get("/api/users")
async def read_users():
    return get_db()["users"]

@app.post("/api/users")
async def add_user(user: User):
    db = get_db()
    if not user.id: user.id = int(asyncio.get_event_loop().time() * 1000)
    db["users"].insert(0, user.dict())
    save_db(db)
    return user

@app.delete("/api/users/{user_id}")
async def delete_user(user_id: int):
    db = get_db()
    db["users"] = [u for u in db["users"] if u.get("id") != user_id]
    save_db(db)
    return {"status": "ok"}

@app.get("/api/logs")
async def read_logs():
    return get_db()["logs"]

@app.post("/api/logs")
async def add_log(log: Log):
    db = get_db()
    if not log.id: log.id = int(asyncio.get_event_loop().time() * 1000)
    db["logs"].insert(0, log.dict())
    save_db(db)
    return log

if __name__ == "__main__":
    import uvicorn
    print("🚀 Nexus IT Central Server [SIMPLE MODE] starting on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
