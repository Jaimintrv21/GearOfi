import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { equipment, technicians } from '../../data/mockData';

interface ScheduleMaintenanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedDate?: string;
}

export function ScheduleMaintenanceDialog({ 
  open, 
  onOpenChange,
  preselectedDate 
}: ScheduleMaintenanceDialogProps) {
  const [formData, setFormData] = useState({
    equipmentId: '',
    title: '',
    description: '',
    scheduledDate: preselectedDate || '',
    frequency: '',
    assignedTo: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Scheduled maintenance data:', formData);
    // Reset form and close dialog
    setFormData({
      equipmentId: '',
      title: '',
      description: '',
      scheduledDate: preselectedDate || '',
      frequency: '',
      assignedTo: '',
    });
    onOpenChange(false);
  };

  const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);
  const selectedTechnician = technicians.find(tech => tech.id === formData.assignedTo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Preventive Maintenance</DialogTitle>
          <DialogDescription>
            Schedule routine maintenance to keep equipment in optimal condition.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="equipment">Select Equipment *</Label>
            <Select
              value={formData.equipmentId}
              onValueChange={(value) => setFormData({ ...formData, equipmentId: value })}
            >
              <SelectTrigger id="equipment">
                <SelectValue placeholder="Choose equipment" />
              </SelectTrigger>
              <SelectContent>
                {equipment.filter(eq => eq.status === 'active').map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEquipment && (
              <div className="text-sm text-gray-500 space-y-1">
                <p>{selectedEquipment.model} • S/N: {selectedEquipment.serialNumber}</p>
                <p>Last Maintenance: {new Date(selectedEquipment.lastMaintenance).toLocaleDateString()}</p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Maintenance Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Monthly calibration check"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the maintenance tasks to be performed..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="annually">Annually</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assign Technician (Optional)</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(value) => setFormData({ ...formData, assignedTo: value })}
            >
              <SelectTrigger id="assignedTo">
                <SelectValue placeholder="Choose technician" />
              </SelectTrigger>
              <SelectContent>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    <div className="flex items-center gap-2">
                      <img 
                        src={tech.avatar} 
                        alt={tech.name}
                        className="w-6 h-6 rounded-full"
                      />
                      <span>{tech.name} - {tech.specialty}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedTechnician && (
              <p className="text-sm text-gray-500">
                Specialty: {selectedTechnician.specialty}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="checklist">Maintenance Checklist (Optional)</Label>
            <Input
              id="checklist"
              type="file"
              accept=".pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500">
              Upload a checklist or procedure document
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="text-blue-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">Preventive Maintenance</p>
                <p className="text-sm text-blue-700 mt-1">
                  Regular scheduled maintenance helps prevent unexpected breakdowns and extends equipment life.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Schedule Maintenance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
