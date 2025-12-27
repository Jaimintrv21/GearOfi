// Mock data: REPLACED BY API. Kept for Types only.

export interface Equipment {
  id: string;
  name: string;
  category: string;
  department: string;
  location: string;
  model: string;
  status: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  documents: any[];
  is_scrapped?: boolean; // match backend
  // Computed for frontend display
  maintenance_team_id?: string;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  equipment_id: string;
  equipmentName?: string; // Enhanced by frontend
  status?: string; // backend uses 'state'
  state?: string;
  request_type: string;
  scheduled_date?: string;
  technician?: string;
  created_at?: string;
  attachments?: string[]; // Legacy
}

export interface Technician {
  id: string;
  name: string;
}

// EMPTY ARRAYS - Forces components to use API or show nothing
export const technicians: Technician[] = [];
export const equipment: Equipment[] = [];
export const maintenanceRequests: MaintenanceRequest[] = [];
export const preventiveMaintenanceSchedule: any[] = [];
