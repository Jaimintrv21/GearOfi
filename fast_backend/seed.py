from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from models import User, MaintenanceTeam, Equipment, MaintenanceRequest, UserRole, EquipmentStatus, RequestType, RequestStage, RequestPriority
from datetime import date, datetime, timedelta
import random

def seed_data():
    db = SessionLocal()
    
    # 1. Clear existing data (in correct order to satisfy foreign keys)
    print("Clearing existing data...")
    db.query(MaintenanceRequest).delete()
    db.query(Equipment).delete()
    # Handle m2m table manually if needed, but cascade might handle it.
    # For safety, let's just clear main tables.
    db.query(MaintenanceTeam).delete()
    db.query(User).delete()
    db.commit()

    print("Seeding data...")

    # 2. Users (Technicians & Managers)
    users = []
    # Manager
    manager = User(email='manager@gearguard.com', password_hash='hashed_123', full_name='Alice Manager', role=UserRole.manager, avatar_url='https://api.dicebear.com/7.x/avataaars/svg?seed=Alice')
    users.append(manager)
    
    # Technicians
    tech_names = ['Bob Fixit', 'Charlie Spark', 'Dave Wrench', 'Eve Solder', 'Frank Gears']
    for i, name in enumerate(tech_names):
        tech = User(
            email=f'tech{i+1}@gearguard.com', 
            password_hash='hashed_123', 
            full_name=name, 
            role=UserRole.technician,
            avatar_url=f'https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(" ", "")}'
        )
        users.append(tech)

    db.add_all(users)
    db.commit()
    
    # Reload users to get IDs
    all_users = db.query(User).all()
    techs = [u for u in all_users if u.role == UserRole.technician]
    manager = [u for u in all_users if u.role == UserRole.manager][0]

    # 3. Teams
    teams_data = ['Heavy Mechanics', 'IT Support', 'Electrical', 'Facility Maintenance']
    teams = []
    for t_name in teams_data:
        team = MaintenanceTeam(name=t_name)
        # Randomly assign 1-2 techs
        team_techs = random.sample(techs, k=random.randint(1, 2))
        team.members.extend(team_techs)
        teams.append(team)
    
    db.add_all(teams)
    db.commit()

    # 4. Equipment
    equipment_list = [
        # Heavy Mechanics
        {'name': 'Generator X500', 'cat': 'Heavy Machinery', 'loc': 'Warehouse A', 'team': 'Heavy Mechanics'},
        {'name': 'Conveyor Belt C1', 'cat': 'Production Line', 'loc': 'Floor 1', 'team': 'Heavy Mechanics'},
        {'name': 'Hydraulic Press H1', 'cat': 'Heavy Machinery', 'loc': 'Floor 2', 'team': 'Heavy Mechanics'},
        
        # IT Support
        {'name': 'Dell Server Rack', 'cat': 'Computers', 'loc': 'Server Room', 'team': 'IT Support'},
        {'name': 'Network Switch A', 'cat': 'Computers', 'loc': 'Server Room', 'team': 'IT Support'},
        
        # Electrical
        {'name': 'Main Circuit Breaker', 'cat': 'Electrical', 'loc': 'Basement', 'team': 'Electrical'},
        {'name': 'HVAC Unit 3', 'cat': 'HVAC', 'loc': 'Roof', 'team': 'Electrical'},
        {'name': 'Backup Battery Bank', 'cat': 'Electrical', 'loc': 'Basement', 'team': 'Electrical'},
        
        # Facility
        {'name': 'Freight Elevator', 'cat': 'Infrastructure', 'loc': 'Lobby', 'team': 'Facility Maintenance'},
        {'name': 'Fire Alarm System', 'cat': 'Safety', 'loc': 'All Floors', 'team': 'Facility Maintenance'},
    ]

    db_equipment = []
    for i, eq in enumerate(equipment_list):
        # Find team
        team = next(t for t in teams if t.name == eq['team'])
        # Pick a tech from that team
        assigned_tech = team.members[0] if team.members else None
        
        db_eq = Equipment(
            name=eq['name'],
            serial_number=f'SN-2024-{1000+i}',
            category=eq['cat'],
            location=eq['loc'],
            status=EquipmentStatus.active if i != 2 else EquipmentStatus.maintenance, # One in maintenance
            assigned_team_id=team.id,
            assigned_technician_id=assigned_tech.id if assigned_tech else None,
            purchase_date=date(2023, 1, 15),
            warranty_end=date(2026, 1, 15)
        )
        db_equipment.append(db_eq)

    db.add_all(db_equipment)
    db.commit()

    # 5. Maintenance Requests (Fake History & Active)
    requests = []
    
    # Past completed requests (for history reports)
    for _ in range(15):
        eq = random.choice(db_equipment)
        req_date = datetime.now() - timedelta(days=random.randint(10, 60))
        requests.append(MaintenanceRequest(
            subject=f'Routine Checkup: {eq.name}',
            req_type=RequestType.preventive,
            stage=RequestStage.repaired,
            priority=RequestPriority.low,
            equipment_id=eq.id,
            team_id=eq.assigned_team_id,
            technician_id=eq.assigned_technician_id,
            created_by_id=manager.id,
            scheduled_date=req_date,
            close_date=req_date + timedelta(hours=2),
            duration_hours=2.5,
            created_at=req_date
        ))

    # Active requests (for Kanban Board/Calendar)
    active_subjects = [
        ('Oil Leak', RequestType.corrective, RequestPriority.high, RequestStage.new),
        ('Overheating Warning', RequestType.corrective, RequestPriority.critical, RequestStage.in_progress),
        ('Software Update', RequestType.preventive, RequestPriority.normal, RequestStage.new),
        ('Filter Replacement', RequestType.preventive, RequestPriority.low, RequestStage.new),
        ('Strange Noise', RequestType.corrective, RequestPriority.normal, RequestStage.in_progress),
        ('Broken Seal', RequestType.corrective, RequestPriority.high, RequestStage.scrap),
    ]

    for subject, r_type, prio, stage in active_subjects:
        eq = random.choice(db_equipment)
        # Ensure scrap match
        if stage == RequestStage.scrap:
            eq.status = EquipmentStatus.scrapped
            db.add(eq)
            db.commit() # Commit the status change before using it in request (though not strictly required, safer)
        
        # Schedule: some future, some overdue
        sched_date = datetime.now() + timedelta(days=random.randint(-2, 5))
        
        requests.append(MaintenanceRequest(
            subject=f'{subject} - {eq.name}',
            req_type=r_type,
            stage=stage,
            priority=prio,
            equipment_id=eq.id,
            team_id=eq.assigned_team_id,
            technician_id=eq.assigned_technician_id,
            created_by_id=manager.id,
            scheduled_date=sched_date,
            created_at=datetime.now() - timedelta(days=1)
        ))

    db.add_all(requests)
    db.commit()
    
    print("Seeding complete! Added extensive fake data.")
    db.close()

if __name__ == "__main__":
    # Ensure tables exist
    models.Base.metadata.create_all(bind=engine)
    seed_data()
