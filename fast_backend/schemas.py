from pydantic import BaseModel
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

# --- Enums matching Models ---
class UserRole(str, Enum):
    manager = 'Manager'
    technician = 'Technician'

class EquipmentStatus(str, Enum):
    active = 'Active'
    maintenance = 'Maintenance'
    scrapped = 'Scrapped'

class RequestType(str, Enum):
    corrective = 'Corrective'
    preventive = 'Preventive'

class RequestStage(str, Enum):
    new = 'New'
    in_progress = 'In Progress'
    repaired = 'Repaired'
    scrap = 'Scrap'

class RequestPriority(str, Enum):
    low = 'Low'
    normal = 'Normal'
    high = 'High'
    critical = 'Critical'

# --- User Schemas ---
class UserBase(BaseModel):
    email: str
    full_name: str
    role: UserRole = UserRole.technician

class UserCreate(UserBase):
    password: str 

class User(UserBase):
    id: int
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True

# --- Maintenance Team Schemas ---
class MaintenanceTeamBase(BaseModel):
    name: str

class MaintenanceTeamCreate(MaintenanceTeamBase):
    pass

class MaintenanceTeam(MaintenanceTeamBase):
    id: int
    # members: List[User] = [] # Circular dependency risk if not careful, keeping simple for now

    class Config:
        from_attributes = True

# --- Equipment Schemas ---
class EquipmentBase(BaseModel):
    name: str
    serial_number: str
    category: Optional[str] = None
    location: Optional[str] = None
    status: EquipmentStatus = EquipmentStatus.active
    purchase_date: Optional[date] = None
    warranty_end: Optional[date] = None

class EquipmentCreate(EquipmentBase):
    assigned_team_id: Optional[int] = None
    assigned_technician_id: Optional[int] = None

class Equipment(EquipmentBase):
    id: int
    assigned_team_id: Optional[int]
    assigned_technician_id: Optional[int]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

# --- Maintenance Request Schemas ---
class MaintenanceRequestBase(BaseModel):
    subject: str
    req_type: RequestType
    priority: RequestPriority = RequestPriority.normal
    scheduled_date: Optional[datetime] = None
    duration_hours: float = 0.0

class MaintenanceRequestCreate(MaintenanceRequestBase):
    equipment_id: int
    # Optional overrides
    team_id: Optional[int] = None
    technician_id: Optional[int] = None
    created_by_id: Optional[int] = None # In real app, from token

class MaintenanceRequest(MaintenanceRequestBase):
    id: int
    stage: RequestStage
    equipment_id: int
    team_id: Optional[int]
    technician_id: Optional[int]
    created_by_id: Optional[int]
    close_date: Optional[datetime]
    created_at: Optional[datetime]

    class Config:
        from_attributes = True

