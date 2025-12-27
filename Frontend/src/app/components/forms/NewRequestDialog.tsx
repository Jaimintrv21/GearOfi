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
import { equipment } from '../../data/mockData';

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewRequestDialog({ open, onOpenChange }: NewRequestDialogProps) {
  const [formData, setFormData] = useState({
    equipmentId: '',
    title: '',
    description: '',
    priority: '',
    dueDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Request data:', formData);
    // Reset form and close dialog
    setFormData({
      equipmentId: '',
      title: '',
      description: '',
      priority: '',
      dueDate: '',
    });
    onOpenChange(false);
  };

  const selectedEquipment = equipment.find(eq => eq.id === formData.equipmentId);

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
                {equipment.filter(eq => eq.status === 'active').map((eq) => (
                  <SelectItem key={eq.id} value={eq.id}>
                    {eq.name} - {eq.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedEquipment && (
              <p className="text-sm text-gray-500">
                {selectedEquipment.model} • S/N: {selectedEquipment.serialNumber}
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
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-gray-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      High
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
