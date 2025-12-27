from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db
from services import Service

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="GearGuard Backend", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- TEAMS ---
@app.post("/teams/", response_model=schemas.MaintenanceTeam)
def create_team(team: schemas.MaintenanceTeamCreate, db: Session = Depends(get_db)):
    return Service.create_team(db, team)

@app.get("/teams/", response_model=List[schemas.MaintenanceTeam])
def read_teams(db: Session = Depends(get_db)):
    return Service.get_teams(db)

# --- EQUIPMENT ---
@app.post("/equipment/", response_model=schemas.Equipment)
def create_equipment(eq: schemas.EquipmentCreate, db: Session = Depends(get_db)):
    return Service.create_equipment(db, eq)

@app.get("/equipment/", response_model=List[schemas.Equipment])
def read_equipment(db: Session = Depends(get_db)):
    return Service.get_equipment(db)

# --- REQUESTS ---
@app.post("/requests/", response_model=schemas.MaintenanceRequest)
def create_request(req: schemas.MaintenanceRequestCreate, db: Session = Depends(get_db)):
    return Service.create_request(db, req)

@app.get("/requests/", response_model=List[schemas.MaintenanceRequest])
def read_requests(db: Session = Depends(get_db)):
    return Service.get_requests(db)

@app.put("/requests/{req_id}/stage", response_model=schemas.MaintenanceRequest)
def update_request_stage(req_id: int, stage: schemas.RequestStage, db: Session = Depends(get_db)):
    return Service.change_stage(db, req_id, stage)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/")
def home():
    return {"message": "GearGuard Backend is Running (SQLite). usage: /docs for swagger"}

if __name__ == "__main__":
    import uvicorn
    # Using 127.0.0.1 is safer for Windows local development
    uvicorn.run(app, host="127.0.0.1", port=8000)

