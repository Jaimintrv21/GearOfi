from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Equipment, MaintenanceTeam, MaintenanceRequest, RequestState
import schemas

class Service:
    
    # --- TEAMS ---
    @staticmethod
    def create_team(db: Session, team: schemas.MaintenanceTeamCreate):
        db_team = MaintenanceTeam(name=team.name, members=team.members)
        db.add(db_team)
        db.commit()
        db.refresh(db_team)
        return db_team

    @staticmethod
    def get_teams(db: Session):
        return db.query(MaintenanceTeam).all()

    # --- EQUIPMENT ---
    @staticmethod
    def create_equipment(db: Session, equipment: schemas.EquipmentCreate):
        db_equipment = Equipment(**equipment.dict())
        db.add(db_equipment)
        db.commit()
        db.refresh(db_equipment)
        return db_equipment

    @staticmethod
    def get_equipment(db: Session):
        return db.query(Equipment).all()

    # --- REQUESTS ---
    @staticmethod
    def create_request(db: Session, req_in: schemas.MaintenanceRequestCreate):
        # 1. Fetch Equipment
        equipment = db.query(Equipment).filter(Equipment.id == req_in.equipment_id).first()
        if not equipment:
            raise HTTPException(status_code=404, detail="Equipment not found")
        
        # 2. Check if Scrapped
        if equipment.is_scrapped:
            raise HTTPException(status_code=400, detail="Cannot create request for scrapped equipment")

        # 3. Validation: Preventive must have date
        if req_in.request_type == 'preventive' and not req_in.scheduled_date:
            raise HTTPException(status_code=400, detail="Preventive requests must have a Scheduled Date")

        # 4. Auto-fill Team/Tech from Equipment defaults (if assigned)
        assigned_team_id = equipment.maintenance_team_id
        assigned_technician = equipment.default_technician
        
        # 5. Validation: Technician must be in Team
        if assigned_team_id:
            team = db.query(MaintenanceTeam).filter(MaintenanceTeam.id == assigned_team_id).first()
            if team and assigned_technician:
                # members is a JSON list of strings
                if assigned_technician not in team.members:
                    raise HTTPException(status_code=400, detail="Technician must be a member of the selected Maintenance Team")

        # Create DB Object
        db_req = MaintenanceRequest(
            subject=req_in.subject,
            equipment_id=req_in.equipment_id,
            request_type=req_in.request_type,
            scheduled_date=req_in.scheduled_date,
            duration=req_in.duration,
            state=RequestState.new,
            maintenance_team_id=assigned_team_id, # Auto-filled
            technician=assigned_technician        # Auto-filled
        )
        
        db.add(db_req)
        db.commit()
        db.refresh(db_req)
        return db_req

    @staticmethod
    def get_requests(db: Session):
        return db.query(MaintenanceRequest).all()

    @staticmethod
    def change_state(db: Session, req_id: int, new_state: RequestState):
        req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == req_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")
        
        req.state = new_state
        
        # Logic: If Scrap, update Equipment
        if new_state == RequestState.scrap:
             if req.equipment:
                 req.equipment.is_scrapped = True
                 db.add(req.equipment) # Mark for update

        db.commit()
        db.refresh(req)
        return req
