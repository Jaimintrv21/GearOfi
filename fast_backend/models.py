from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

# Enums
class RequestType(str, Enum):
    CORRECTIVE = "corrective"
    PREVENTIVE = "preventive"

class RequestState(str, Enum):
    NEW = "new"
    IN_PROGRESS = "in_progress"
    REPAIRED = "repaired"
    SCRAP = "scrap"

# --- Maintenance Teams ---
class MaintenanceTeamBase(BaseModel):
    name: str
    members: List[str]  # List of technician names

class MaintenanceTeam(MaintenanceTeamBase):
    id: str

# --- Equipment ---
class EquipmentBase(BaseModel):
    name: str
    serial_number: str
    department: str
    employee: str  # Custodian
    maintenance_team_id: str
    default_technician: str  # Name of default tech
    location: str
    warranty_end_date: date

class Equipment(EquipmentBase):
    id: str
    is_scrapped: bool = False

# --- Maintenance Requests ---
class MaintenanceRequestBase(BaseModel):
    subject: str
    equipment_id: str
    request_type: RequestType
    scheduled_date: Optional[datetime] = None
    
    # Optional because they can be auto-filled
    maintenance_team_id: Optional[str] = None
    technician: Optional[str] = None
    duration: float = 0.0

class MaintenanceRequest(MaintenanceRequestBase):
    id: str
    state: RequestState = RequestState.NEW
    created_at: datetime = datetime.now()
