from fastapi import HTTPException
from database import db, get_team, get_equipment
from models import MaintenanceRequestBase, MaintenanceRequest, RequestType, RequestState
import uuid

class Service:
    @staticmethod
    def create_request(data: MaintenanceRequestBase) -> MaintenanceRequest:
        # 1. Fetch Equipment
        equipment = get_equipment(data.equipment_id)
        if not equipment:
            raise HTTPException(status_code=404, detail="Equipment not found")
        
        if equipment.is_scrapped:
            raise HTTPException(status_code=400, detail="Cannot create request for scrapped equipment")

        # 2. Auto-Fill Logic
        if not data.maintenance_team_id:
            data.maintenance_team_id = equipment.maintenance_team_id
        if not data.technician:
            data.technician = equipment.default_technician
            
        # 3. Validation: Team Membership
        team = get_team(data.maintenance_team_id)
        if not team:
            raise HTTPException(status_code=404, detail="Maintenance Team not found")
        
        if data.technician and data.technician not in team.members:
            raise HTTPException(status_code=400, detail=f"Technician '{data.technician}' is not in team '{team.name}'")

        # 4. Validation: Preventive Schedule
        if data.request_type == RequestType.PREVENTIVE and not data.scheduled_date:
            raise HTTPException(status_code=400, detail="Preventive requests must have a Scheduled Date")

        # Create
        new_req = MaintenanceRequest(id=str(uuid.uuid4()), **data.dict())
        db["requests"][new_req.id] = new_req
        return new_req

    @staticmethod
    def change_state(req_id: str, new_state: RequestState) -> MaintenanceRequest:
        req = db["requests"].get(req_id)
        if not req:
            raise HTTPException(status_code=404, detail="Request not found")
            
        req.state = new_state
        
        # 5. Logic: Scrap
        if new_state == RequestState.SCRAP:
            equipment = get_equipment(req.equipment_id)
            if equipment:
                equipment.is_scrapped = True
        
        return req
