from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import uuid

from models import (
    MaintenanceTeam, MaintenanceTeamBase, 
    Equipment, EquipmentBase,
    MaintenanceRequest, MaintenanceRequestBase, RequestState
)
from database import db
from services import Service

app = FastAPI(title="GearGuard Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Teams ---
@app.post("/teams/", response_model=MaintenanceTeam)
def create_team(team: MaintenanceTeamBase):
    new_team = MaintenanceTeam(id=str(uuid.uuid4()), **team.dict())
    db["teams"][new_team.id] = new_team
    return new_team

@app.get("/teams/", response_model=List[MaintenanceTeam])
def list_teams():
    return list(db["teams"].values())

# --- Equipment ---
@app.post("/equipment/", response_model=Equipment)
def create_equipment(equip: EquipmentBase):
    new_equip = Equipment(id=str(uuid.uuid4()), **equip.dict())
    db["equipment"][new_equip.id] = new_equip
    return new_equip

@app.get("/equipment/", response_model=List[Equipment])
def list_equipment():
    return list(db["equipment"].values())

# --- Requests ---
@app.post("/requests/", response_model=MaintenanceRequest)
def create_request(req_data: MaintenanceRequestBase):
    """
    Creates a request with Auto-fill and Validation logic.
    """
    return Service.create_request(req_data)

@app.get("/requests/", response_model=List[MaintenanceRequest])
def list_requests():
    return list(db["requests"].values())

@app.put("/requests/{req_id}/state", response_model=MaintenanceRequest)
def update_request_state(req_id: str, state: RequestState):
    """
    Updates state. If 'scrap', marks equipment as scrapped.
    """
    return Service.change_state(req_id, state)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "GearGuard Backend is Running. usage: /docs for swagger"}

if __name__ == "__main__":
    import uvicorn
    print("Starting GearGuard Backend...")
    # Using 127.0.0.1 is safer for Windows local development
    uvicorn.run(app, host="127.0.0.1", port=8000)
