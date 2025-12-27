from typing import Dict
from models import Equipment, MaintenanceTeam, MaintenanceRequest

# In-memory storage
db = {
    "teams": {},       # id -> MaintenanceTeam
    "equipment": {},   # id -> Equipment
    "requests": {}     # id -> MaintenanceRequest
}

def get_team(team_id: str) -> MaintenanceTeam | None:
    return db["teams"].get(team_id)

def get_equipment(equip_id: str) -> Equipment | None:
    return db["equipment"].get(equip_id)

def get_request(req_id: str) -> MaintenanceRequest | None:
    return db["requests"].get(req_id)
