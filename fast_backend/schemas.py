from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from enum import Enum

# Enums
class RequestType(str, Enum):
    corrective = 'corrective'
    preventive = 'preventive'

class RequestState(str, Enum):
    new = 'new'
    in_progress = 'in_progress'
    repaired = 'repaired'
    scrap = 'scrap'

# --- Equipment Schemas ---
class EquipmentBase(BaseModel):
    name: str
    serial_number: str
    department: str
    employee: Optional[str] = None
    location: Optional[str] = None
    default_technician: Optional[str] = None

class EquipmentCreate(EquipmentBase):
    pass

class Equipment(EquipmentBase):
    id: int
    maintenance_team_id: Optional[int] = None
    is_scrapped: bool = False

    class Config:
        orm_mode = True

# --- Maintenance Team Schemas ---
class MaintenanceTeamBase(BaseModel):
    name: str
    # Storing members as list of strings (technician names)
    members: List[str] = []

class MaintenanceTeamCreate(MaintenanceTeamBase):
    pass

class MaintenanceTeam(MaintenanceTeamBase):
    id: int

    class Config:
        orm_mode = True

# --- Maintenance Request Schemas ---
class MaintenanceRequestBase(BaseModel):
    subject: str
    equipment_id: int
    request_type: RequestType
    scheduled_date: Optional[date] = None
    duration: float = 0.0

class MaintenanceRequestCreate(MaintenanceRequestBase):
    pass

class MaintenanceRequest(MaintenanceRequestBase):
    id: int
    maintenance_team_id: Optional[int] = None
    technician: Optional[str] = None
    state: RequestState = RequestState.new

    class Config:
        orm_mode = True
