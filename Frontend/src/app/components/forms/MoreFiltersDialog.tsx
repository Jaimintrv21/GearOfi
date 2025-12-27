import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { useEquipment } from '../../contexts/EquipmentContext';

interface MoreFiltersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    department: string;
    location: string;
    purchaseDateFrom: string;
    purchaseDateTo: string;
    warrantyExpiryFrom: string;
    warrantyExpiryTo: string;
  };
  onFiltersChange: (filters: {
    department: string;
    location: string;
    purchaseDateFrom: string;
    purchaseDateTo: string;
    warrantyExpiryFrom: string;
    warrantyExpiryTo: string;
  }) => void;
}

export function MoreFiltersDialog({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}: MoreFiltersDialogProps) {
  const { equipment } = useEquipment();
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);


  const locations = [...new Set(equipment.map(e => e.location))];

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = {
      department: 'all',
      location: 'all',
      purchaseDateFrom: '',
      purchaseDateTo: '',
      warrantyExpiryFrom: '',
      warrantyExpiryTo: '',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>More Filters</DialogTitle>
          <DialogDescription>
            Apply additional filters to refine your equipment search.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-department">Department</Label>
              <Select
                value={localFilters.department}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, department: value })
                }
              >
                <SelectTrigger id="filter-department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Facilities">Facilities</SelectItem>
                  <SelectItem value="Warehouse">Warehouse</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-location">Location</Label>
              <Select
                value={localFilters.location}
                onValueChange={(value) =>
                  setLocalFilters({ ...localFilters, location: value })
                }
              >
                <SelectTrigger id="filter-location">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Purchase Date Range</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchase-date-from" className="text-xs text-gray-500">
                  From
                </Label>
                <Input
                  id="purchase-date-from"
                  type="date"
                  value={localFilters.purchaseDateFrom}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, purchaseDateFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase-date-to" className="text-xs text-gray-500">
                  To
                </Label>
                <Input
                  id="purchase-date-to"
                  type="date"
                  value={localFilters.purchaseDateTo}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, purchaseDateTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Warranty Expiry Date Range</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="warranty-expiry-from" className="text-xs text-gray-500">
                  From
                </Label>
                <Input
                  id="warranty-expiry-from"
                  type="date"
                  value={localFilters.warrantyExpiryFrom}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, warrantyExpiryFrom: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="warranty-expiry-to" className="text-xs text-gray-500">
                  To
                </Label>
                <Input
                  id="warranty-expiry-to"
                  type="date"
                  value={localFilters.warrantyExpiryTo}
                  onChange={(e) =>
                    setLocalFilters({ ...localFilters, warrantyExpiryTo: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleApply}>
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

