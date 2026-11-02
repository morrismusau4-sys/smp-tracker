
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow browser requests during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary storage for check-ins
checkins = []

class CheckIn(BaseModel):
    name: str
    sleep: float
    water: int
    steps: int

# GET: Return all check-ins
@app.get("/api/checkins")
def get_checkins():
    return checkins

# POST: Receive and store a check-in
@app.post("/api/checkins")
def add_checkin(data: CheckIn):
    entry = data.model_dump()
    entry["hit_goal"] = data.steps >= 10000
    checkins.append(entry)
    return {"success": True, "stored": entry}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Allow browser requests during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Temporary storage for check-ins
checkins = []

class CheckIn(BaseModel):
    name: str
    sleep: float
    water: int
    steps: int

# GET: Return all check-ins
@app.get("/api/checkins")
def get_checkins():
    return checkins

# POST: Receive and store a check-in
@app.post("/api/checkins")
def add_checkin(data: CheckIn):
    entry = data.model_dump()
    entry["hit_goal"] = data.steps >= 10000
    checkins.append(entry)
    return {"success": True, "stored": entry}

