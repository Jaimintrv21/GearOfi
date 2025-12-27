// Mock data for the Equipment Maintenance Management System

export interface Equipment {
  id: string;
  name: string;
  category: string;
  department: string;
  location: string;
  status: 'active' | 'scrapped';
  model: string;
  serialNumber: string;
  purchaseDate: string;
  warrantyExpiry: string;
  lastMaintenance: string;
  documents: Document[];
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  uploadDate: string;
}

export interface MaintenanceRequest {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  description: string;
  status: 'new' | 'in-progress' | 'repaired' | 'scrap';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdDate: string;
  assignedTo?: string;
  assignedToAvatar?: string;
  attachments: string[];
  beforeImages: string[];
  afterImages: string[];
  reportPdf?: string;
}

export interface Technician {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
}

// Mock Technicians
export const technicians: Technician[] = [
  { id: '1', name: 'John Smith', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', specialty: 'Electrical' },
  { id: '2', name: 'Sarah Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', specialty: 'Mechanical' },
  { id: '3', name: 'Mike Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', specialty: 'HVAC' },
  { id: '4', name: 'Emily Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', specialty: 'Plumbing' },
];

// Mock Equipment
export const equipment: Equipment[] = [
  {
    id: 'eq-001',
    name: 'CNC Machine #1',
    category: 'Manufacturing',
    department: 'Production',
    location: 'Building A - Floor 2',
    status: 'active',
    model: 'Haas VF-2',
    serialNumber: 'SN-2023-001',
    purchaseDate: '2023-01-15',
    warrantyExpiry: '2026-01-15',
    lastMaintenance: '2024-11-20',
    documents: [
      { id: 'doc-1', name: 'Warranty.pdf', type: 'pdf', url: '#', uploadDate: '2023-01-15' },
      { id: 'doc-2', name: 'Invoice.pdf', type: 'pdf', url: '#', uploadDate: '2023-01-15' },
      { id: 'doc-3', name: 'Manual.pdf', type: 'pdf', url: '#', uploadDate: '2023-01-15' },
      { id: 'doc-4', name: 'AMC_contract.pdf', type: 'pdf', url: '#', uploadDate: '2023-02-01' },
    ],
  },
  {
    id: 'eq-002',
    name: 'HVAC Unit #3',
    category: 'HVAC',
    department: 'Facilities',
    location: 'Building B - Roof',
    status: 'active',
    model: 'Carrier 50TC',
    serialNumber: 'SN-2022-045',
    purchaseDate: '2022-06-10',
    warrantyExpiry: '2025-06-10',
    lastMaintenance: '2024-12-01',
    documents: [
      { id: 'doc-5', name: 'Warranty.pdf', type: 'pdf', url: '#', uploadDate: '2022-06-10' },
      { id: 'doc-6', name: 'Installation_Guide.pdf', type: 'pdf', url: '#', uploadDate: '2022-06-10' },
    ],
  },
  {
    id: 'eq-003',
    name: 'Forklift #7',
    category: 'Material Handling',
    department: 'Warehouse',
    location: 'Warehouse - Zone C',
    status: 'active',
    model: 'Toyota 8FGU25',
    serialNumber: 'SN-2021-112',
    purchaseDate: '2021-03-20',
    warrantyExpiry: '2024-03-20',
    lastMaintenance: '2024-12-10',
    documents: [
      { id: 'doc-7', name: 'Manual.pdf', type: 'pdf', url: '#', uploadDate: '2021-03-20' },
      { id: 'doc-8', name: 'Safety_Cert.pdf', type: 'pdf', url: '#', uploadDate: '2021-03-25' },
    ],
  },
  {
    id: 'eq-004',
    name: 'Printer Station A',
    category: 'Office Equipment',
    department: 'Administration',
    location: 'Building A - Floor 1',
    status: 'active',
    model: 'HP LaserJet Pro',
    serialNumber: 'SN-2023-067',
    purchaseDate: '2023-08-05',
    warrantyExpiry: '2024-08-05',
    lastMaintenance: '2024-11-15',
    documents: [
      { id: 'doc-9', name: 'Warranty.pdf', type: 'pdf', url: '#', uploadDate: '2023-08-05' },
    ],
  },
  {
    id: 'eq-005',
    name: 'Compressor #2',
    category: 'Manufacturing',
    department: 'Production',
    location: 'Building A - Basement',
    status: 'scrapped',
    model: 'Atlas Copco GA22',
    serialNumber: 'SN-2018-034',
    purchaseDate: '2018-05-12',
    warrantyExpiry: '2021-05-12',
    lastMaintenance: '2024-09-30',
    documents: [],
  },
];

// Mock Maintenance Requests
export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'mr-001',
    equipmentId: 'eq-001',
    equipmentName: 'CNC Machine #1',
    title: 'Spindle alignment issue',
    description: 'Machine showing vibration during high-speed operations',
    status: 'new',
    priority: 'high',
    dueDate: '2024-12-30',
    createdDate: '2024-12-26',
    attachments: ['📎 error_log.txt', '📷 vibration_video.mp4'],
    beforeImages: [],
    afterImages: [],
  },
  {
    id: 'mr-002',
    equipmentId: 'eq-002',
    equipmentName: 'HVAC Unit #3',
    title: 'Filter replacement',
    description: 'Scheduled filter replacement as per maintenance schedule',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-12-28',
    createdDate: '2024-12-20',
    assignedTo: 'Mike Chen',
    assignedToAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    attachments: ['📎 filter_specs.pdf'],
    beforeImages: [],
    afterImages: [],
  },
  {
    id: 'mr-003',
    equipmentId: 'eq-003',
    equipmentName: 'Forklift #7',
    title: 'Brake system check',
    description: 'Annual brake system inspection and service',
    status: 'repaired',
    priority: 'high',
    dueDate: '2024-12-25',
    createdDate: '2024-12-15',
    assignedTo: 'Sarah Johnson',
    assignedToAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    attachments: ['📎 brake_report.pdf', '📷 before_1.jpg', '📷 after_1.jpg'],
    beforeImages: ['https://placehold.co/600x400/orange/white?text=Before+Repair'],
    afterImages: ['https://placehold.co/600x400/green/white?text=After+Repair'],
    reportPdf: 'brake_inspection_report.pdf',
  },
  {
    id: 'mr-004',
    equipmentId: 'eq-004',
    equipmentName: 'Printer Station A',
    title: 'Paper jam and toner low',
    description: 'Printer frequently jamming, toner needs replacement',
    status: 'new',
    priority: 'low',
    dueDate: '2025-01-05',
    createdDate: '2024-12-26',
    attachments: [],
    beforeImages: [],
    afterImages: [],
  },
  {
    id: 'mr-005',
    equipmentId: 'eq-005',
    equipmentName: 'Compressor #2',
    title: 'Complete failure - motor burnt',
    description: 'Motor completely burnt out, not economical to repair',
    status: 'scrap',
    priority: 'high',
    dueDate: '2024-10-01',
    createdDate: '2024-09-25',
    assignedTo: 'John Smith',
    assignedToAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    attachments: ['📎 damage_assessment.pdf', '📷 burnt_motor.jpg'],
    beforeImages: ['https://placehold.co/600x400/red/white?text=Damaged+Motor'],
    afterImages: [],
    reportPdf: 'scrap_recommendation.pdf',
  },
  {
    id: 'mr-006',
    equipmentId: 'eq-001',
    equipmentName: 'CNC Machine #1',
    title: 'Coolant system maintenance',
    description: 'Coolant level low, needs refill and system check',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2024-12-27',
    createdDate: '2024-12-24',
    assignedTo: 'Emily Davis',
    assignedToAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    attachments: ['📎 coolant_specs.pdf'],
    beforeImages: [],
    afterImages: [],
  },
];

// Preventive Maintenance Schedule
export interface PreventiveMaintenance {
  id: string;
  equipmentId: string;
  equipmentName: string;
  title: string;
  scheduledDate: string;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'annually';
  assignedTo?: string;
}

export const preventiveMaintenanceSchedule: PreventiveMaintenance[] = [
  {
    id: 'pm-001',
    equipmentId: 'eq-001',
    equipmentName: 'CNC Machine #1',
    title: 'Monthly calibration check',
    scheduledDate: '2025-01-05',
    frequency: 'monthly',
    assignedTo: 'Sarah Johnson',
  },
  {
    id: 'pm-002',
    equipmentId: 'eq-002',
    equipmentName: 'HVAC Unit #3',
    title: 'Quarterly filter replacement',
    scheduledDate: '2025-01-10',
    frequency: 'quarterly',
    assignedTo: 'Mike Chen',
  },
  {
    id: 'pm-003',
    equipmentId: 'eq-003',
    equipmentName: 'Forklift #7',
    title: 'Weekly safety inspection',
    scheduledDate: '2025-01-02',
    frequency: 'weekly',
  },
];
