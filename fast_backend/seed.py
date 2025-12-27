from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from models import User, MaintenanceTeam, Equipment, MaintenanceRequest, UserRole, EquipmentStatus, RequestType, RequestStage, RequestPriority
from datetime import date, datetime

def seed_data():
    db = SessionLocal()
    
    # Check if data exists
    if db.query(User).first():
        print("Data already exists. Skipping seed.")
        return

    print("Seeding data...")

    # 1. Users
    manager = User(email='manager@gearguard.com', password_hash='hashed_secret_123', full_name='Alice Manager', role=UserRole.manager)
    tech1 = User(email='tech1@gearguard.com', password_hash='hashed_secret_123', full_name='Bob Fixit', role=UserRole.technician)
    tech2 = User(email='tech2@gearguard.com', password_hash='hashed_secret_123', full_name='Charlie Spark', role=UserRole.technician)
    
    db.add_all([manager, tech1, tech2])
    db.commit()

    # 2. Teams
    mechanics = MaintenanceTeam(name='Heavy Mechanics')
    it_support = MaintenanceTeam(name='IT Support')
    
    db.add_all([mechanics, it_support])
    db.commit()

    # 3. Assign Techs
    mechanics.members.append(tech1)
    it_support.members.append(tech2)
    db.commit()

    # 4. Equipment
    gen_x500 = Equipment(
        name='Generator X500', 
        serial_number='GEN-2024-001', 
        category='Heavy Machinery', 
        location='Warehouse A',
        status=EquipmentStatus.active,
        assigned_team_id=mechanics.id, 
        assigned_technician_id=tech1.id
    )
    
    server_rack = Equipment(
        name='Dell Server Rack', 
        serial_number='SRV-2024-999', 
        category='Computers', 
        location='Server Room',
        status=EquipmentStatus.active,
        assigned_team_id=it_support.id, 
        assigned_technician_id=tech2.id
    )

    db.add_all([gen_x500, server_rack])
    db.commit()

    # 5. Maintenance Request
    req1 = MaintenanceRequest(
        subject='Oil Leak Detected',
        req_type=RequestType.corrective,
        stage=RequestStage.new,
        priority=RequestPriority.normal,
        equipment_id=gen_x500.id,
        team_id=mechanics.id,
        technician_id=tech1.id,
        created_by_id=manager.id,
        scheduled_date=datetime.now()
    )

    db.add(req1)
    db.commit()
    
    print("Seeding complete!")
    db.close()

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    seed_data()
