from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey, Enum as SQLEnum, JSON, Table, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

# --- Enums (Matching schema.sql) ---
class UserRole(str, enum.Enum):
    manager = 'Manager'
    technician = 'Technician'

class EquipmentStatus(str, enum.Enum):
    active = 'Active'
    maintenance = 'Maintenance'
    scrapped = 'Scrapped'

class RequestType(str, enum.Enum):
    corrective = 'Corrective'
    preventive = 'Preventive'

class RequestStage(str, enum.Enum):
    new = 'New'
    in_progress = 'In Progress'
    repaired = 'Repaired'
    scrap = 'Scrap'

class RequestPriority(str, enum.Enum):
    low = 'Low'
    normal = 'Normal'
    high = 'High'
    critical = 'Critical'

# --- Association Table for Team Members ---
team_members = Table(
    'team_members',
    Base.metadata,
    Column('team_id', Integer, ForeignKey('maintenance_teams.id', ondelete='CASCADE'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
)

# --- Models ---

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.technician, nullable=False)
    avatar_url = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    teams = relationship("MaintenanceTeam", secondary=team_members, back_populates="members")
    # Reverse relation for requests assigned
    requests_assigned = relationship("MaintenanceRequest", foreign_keys="[MaintenanceRequest.technician_id]", back_populates="technician")
    requests_created = relationship("MaintenanceRequest", foreign_keys="[MaintenanceRequest.created_by_id]", back_populates="created_by")
    # Equipment assigned to this tech
    assigned_equipment = relationship("Equipment", back_populates="assigned_technician")

class MaintenanceTeam(Base):
    __tablename__ = "maintenance_teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # Relationships
    members = relationship("User", secondary=team_members, back_populates="teams")
    equipments = relationship("Equipment", back_populates="team")
    requests = relationship("MaintenanceRequest", back_populates="team")

class Equipment(Base):
    __tablename__ = "equipment"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    serial_number = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=True)
    location = Column(String, nullable=True)
    status = Column(SQLEnum(EquipmentStatus), default=EquipmentStatus.active)
    
    # Foreign Keys
    assigned_team_id = Column(Integer, ForeignKey("maintenance_teams.id", ondelete="SET NULL"), nullable=True)
    assigned_technician_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Meta
    purchase_date = Column(Date, nullable=True)
    warranty_end = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    team = relationship("MaintenanceTeam", back_populates="equipments")
    assigned_technician = relationship("User", back_populates="assigned_equipment")
    requests = relationship("MaintenanceRequest", back_populates="equipment")

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, nullable=False)
    req_type = Column(SQLEnum(RequestType), nullable=False)
    stage = Column(SQLEnum(RequestStage), default=RequestStage.new)
    priority = Column(SQLEnum(RequestPriority), default=RequestPriority.normal)
    
    # Foreign Keys
    equipment_id = Column(Integer, ForeignKey("equipment.id", ondelete="CASCADE"))
    team_id = Column(Integer, ForeignKey("maintenance_teams.id", ondelete="SET NULL"), nullable=True)
    technician_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Scheduling
    scheduled_date = Column(DateTime, nullable=True)
    close_date = Column(DateTime, nullable=True)
    duration_hours = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    equipment = relationship("Equipment", back_populates="requests")
    team = relationship("MaintenanceTeam", back_populates="requests")
    technician = relationship("User", foreign_keys=[technician_id], back_populates="requests_assigned")
    created_by = relationship("User", foreign_keys=[created_by_id], back_populates="requests_created")

