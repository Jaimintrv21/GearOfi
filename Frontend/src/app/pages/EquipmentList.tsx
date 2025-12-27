import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';
import { AddEquipmentDialog } from '../components/forms/AddEquipmentDialog';
import { EditEquipmentDialog } from '../components/forms/EditEquipmentDialog';
import { MoreFiltersDialog } from '../components/forms/MoreFiltersDialog';
import { useEquipment } from '../contexts/EquipmentContext';

export function EquipmentList() {
  const navigate = useNavigate();
  const { equipment, deleteEquipment } = useEquipment();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [moreFilters, setMoreFilters] = useState({
    department: 'all',
    location: 'all',
    purchaseDateFrom: '',
    purchaseDateTo: '',
    warrantyExpiryFrom: '',
    warrantyExpiryTo: '',
  });



  const filteredEquipment = equipment.filter(eq => {
    const matchesSearch = searchTerm === '' ||
      eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      eq.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || eq.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || eq.status === statusFilter;
    const matchesDepartment = moreFilters.department === 'all' || eq.department === moreFilters.department;
    const matchesLocation = moreFilters.location === 'all' || eq.location === moreFilters.location;

    const matchesPurchaseDate =
      (!moreFilters.purchaseDateFrom || new Date(eq.purchaseDate) >= new Date(moreFilters.purchaseDateFrom)) &&
      (!moreFilters.purchaseDateTo || new Date(eq.purchaseDate) <= new Date(moreFilters.purchaseDateTo));

    const matchesWarrantyExpiry =
      (!moreFilters.warrantyExpiryFrom || new Date(eq.warrantyExpiry) >= new Date(moreFilters.warrantyExpiryFrom)) &&
      (!moreFilters.warrantyExpiryTo || new Date(eq.warrantyExpiry) <= new Date(moreFilters.warrantyExpiryTo));

    return matchesSearch && matchesCategory && matchesStatus && matchesDepartment &&
      matchesLocation && matchesPurchaseDate && matchesWarrantyExpiry;
  });

  const handleEdit = (e: React.MouseEvent, equipmentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEquipment(equipmentId);
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent, equipmentId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedEquipment(equipmentId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedEquipment) {
      deleteEquipment(selectedEquipment);
      setShowDeleteDialog(false);
      setSelectedEquipment(null);
    }
  };

  const selectedEquipmentData = selectedEquipment
    ? equipment.find(eq => eq.id === selectedEquipment)
    : null;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Equipment</h1>
          <p className="text-gray-600 mt-1">Manage your equipment inventory</p>
        </div>
        <Button className="w-full lg:w-auto" onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Equipment
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search equipment..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                <SelectItem value="HVAC">HVAC</SelectItem>
                <SelectItem value="Material Handling">Material Handling</SelectItem>
                <SelectItem value="Office Equipment">Office Equipment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scrapped">Scrapped</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="w-full" onClick={() => setShowMoreFilters(true)}>
              <Filter className="w-4 h-4 mr-2" />
              More Filters
              {(moreFilters.department !== 'all' ||
                moreFilters.location !== 'all' ||
                moreFilters.purchaseDateFrom ||
                moreFilters.purchaseDateTo ||
                moreFilters.warrantyExpiryFrom ||
                moreFilters.warrantyExpiryTo) && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-blue-600"></span>
                )}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {filteredEquipment.length} of {equipment.length} equipment
          </div>
        </CardContent>
      </Card>

      {/* Equipment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEquipment.map((eq) => (
          <div key={eq.id} className="relative group">
            <Link to={`/equipment/${eq.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg text-gray-900 mb-1 truncate">{eq.name}</h3>
                      <p className="text-sm text-gray-600">{eq.model}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${eq.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {eq.status}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{eq.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-gray-900 truncate ml-2">{eq.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-900">{eq.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Maintenance:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(eq.lastMaintenance).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>S/N: {eq.serialNumber}</span>
                      <span>{eq.documents.length} docs</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleEdit(e, eq.id)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => handleDelete(e, eq.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No equipment found matching your filters.</p>
          </CardContent>
        </Card>
      )}

      <AddEquipmentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <EditEquipmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        equipment={selectedEquipmentData || null}
      />
      <MoreFiltersDialog
        open={showMoreFilters}
        onOpenChange={setShowMoreFilters}
        filters={moreFilters}
        onFiltersChange={setMoreFilters}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment
              {selectedEquipmentData && ` "${selectedEquipmentData.name}"`} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}