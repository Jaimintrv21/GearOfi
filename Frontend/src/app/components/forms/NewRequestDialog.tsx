import { useState, useEffect } from 'react';
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
import { api } from '../../../services/api';

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function NewRequestDialog({ open, onOpenChange, onSuccess }: NewRequestDialogProps) {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    equipmentId: '',
    title: '',
    description: '',
    priority: '',
    dueDate: '',
  });

  useEffect(() => {
    if (open) {
      api.fetchEquipment().then(setEquipmentList).catch(console.error);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRequest({
        equipment_id: parseInt(formData.equipmentId),
        subject: formData.title,
        req_type: 'Corrective', // Default or add field
        priority: formData.priority,
        scheduled_date: formData.dueDate
      });

      // Reset form and close dialog
      setFormData({
        equipmentId: '',
        title: '',
        description: '',
        priority: '',
        dueDate: '',
      });
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("Failed to create request", err);
      alert("Failed to create request");
    }
  };

  const selectedEquipment = equipmentList.find(eq => eq.id.toString() === formData.equipmentId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Maintenance Request</DialogTitle>
          <DialogDescription>
            Submit a new maintenance request for equipment that needs attention.
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
                {equipmentList.filter(eq => eq.status === 'Active').map((eq) => (
                  <SelectItem key={eq.id} value={eq.id.toString()}>
                    {eq.name} - {eq.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEquipment && (
              <p className="text-sm text-gray-500">
                {selectedEquipment.category} • S/N: {selectedEquipment.serial_number}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Issue Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Spindle alignment issue"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the issue in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="Normal">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Normal
                    </div>
                  </SelectItem>
                  <SelectItem value="High">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High
                    </div>
                  </SelectItem>
                  <SelectItem value="Critical">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-900" />
                      Critical
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments (Optional)</Label>
            <Input
              id="attachments"
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
            />
            <p className="text-xs text-gray-500">
              Upload images, documents, or error logs (max 10MB per file)
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Request</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
