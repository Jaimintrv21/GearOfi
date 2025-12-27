from sqlalchemy import Column, Integer, String, Boolean, Date, Float, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.orm import relationship
from database import Base
import enum

# Define Python Enums for SQLAlchemy
class RequestType(str, enum.Enum):
    corrective = 'corrective'
    preventive = 'preventive'

class RequestState(str, enum.Enum):
    new = 'new'
    in_progress = 'in_progress'
    repaired = 'repaired'
    scrap = 'scrap'

class MaintenanceTeam(Base):
    __tablename__ = "maintenance_teams"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    # Storing primitive list of strings as JSON
    members = Column(JSON, default=[])

    # Relationships
    equipments = relationship("Equipment", back_populates="team")
    requests = relationship("MaintenanceRequest", back_populates="team")

class Equipment(Base):
    __tablename__ = "equipments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    serial_number = Column(String, unique=True, index=True)
    department = Column(String)
    employee = Column(String, nullable=True)
    location = Column(String, nullable=True)
    is_scrapped = Column(Boolean, default=False)
    
    # Auto-assignment fields
    maintenance_team_id = Column(Integer, ForeignKey("maintenance_teams.id"), nullable=True)
    default_technician = Column(String, nullable=True)

    # Relationships
    team = relationship("MaintenanceTeam", back_populates="equipments")
    requests = relationship("MaintenanceRequest", back_populates="equipment")

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String)
    
    # Foreign Keys
    equipment_id = Column(Integer, ForeignKey("equipments.id"))
    maintenance_team_id = Column(Integer, ForeignKey("maintenance_teams.id"), nullable=True)
    
    technician = Column(String, nullable=True)
    request_type = Column(SQLEnum(RequestType), default=RequestType.corrective)
    scheduled_date = Column(Date, nullable=True)
    duration = Column(Float, default=0.0)
    state = Column(SQLEnum(RequestState), default=RequestState.new)

    # Relationships
    equipment = relationship("Equipment", back_populates="requests")
    team = relationship("MaintenanceTeam", back_populates="requests")
