from fastapi import HTTPException
from sqlalchemy.orm import Session
from models import Equipment, MaintenanceTeam, MaintenanceRequest, User, RequestStage, EquipmentStatus
import schemas

class Service:
    
    # --- TEAMS ---
    @staticmethod
    def create_team(db: Session, team: schemas.MaintenanceTeamCreate):
        # members logic removed as it requires User creation which is separate now
        db_team = MaintenanceTeam(name=team.name)
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
        if equipment.status == EquipmentStatus.scrapped:
            raise HTTPException(status_code=400, detail="Cannot create request for scrapped equipment")

        # 3. Validation: Preventive must have date
        if req_in.req_type == 'Preventive' and not req_in.scheduled_date:
             raise HTTPException(status_code=400, detail="Preventive requests must have a Scheduled Date")

        # 4. Auto-fill Team/Tech from Equipment defaults (if assigned and not overridden)
        assigned_team_id = req_in.team_id if req_in.team_id else equipment.assigned_team_id
        assigned_technician_id = req_in.technician_id if req_in.technician_id else equipment.assigned_technician_id
        
        # 5. Validation: Technician must be in Team (Skipping for now as we don't have easy check without Members loaded)
        # In a real app we would check: if assigned_technician_id and assigned_team_id: verify link.

        # Create DB Object
        db_req = MaintenanceRequest(
            subject=req_in.subject,
            equipment_id=req_in.equipment_id,
            req_type=req_in.req_type,
            priority=req_in.priority,
            scheduled_date=req_in.scheduled_date,
            duration_hours=req_in.duration_hours,
            stage=RequestStage.new,
            team_id=assigned_team_id,
            technician_id=assigned_technician_id,
            created_by_id=req_in.created_by_id
        )
        
        db.add(db_req)
        db.commit()
        db.refresh(db_req)
        return db_req

    @staticmethod
    def get_requests(db: Session):
        return db.query(MaintenanceRequest).all()

    @staticmethod
    def change_stage(db: Session, req_id: int, new_stage: schemas.RequestStage):
        req = db.query(MaintenanceRequest).filter(MaintenanceRequest.id == req_id).first()
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")
        
        req.stage = new_stage
        
        # Logic: If Scrap, update Equipment
        if new_stage == schemas.RequestStage.scrap:
             if req.equipment:
                 req.equipment.status = EquipmentStatus.scrapped
                 db.add(req.equipment) # Mark for update

        db.commit()
        db.refresh(req)
        return req
