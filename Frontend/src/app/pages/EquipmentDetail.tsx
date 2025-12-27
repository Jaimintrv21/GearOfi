import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, FileText, History, Users, BarChart, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
import { EditEquipmentDialog } from '../components/forms/EditEquipmentDialog';
import { useEquipment } from '../contexts/EquipmentContext';
import { maintenanceRequests } from '../data/mockData';

export function EquipmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEquipmentById, deleteEquipment } = useEquipment();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const eq = getEquipmentById(id || '');
  const history = maintenanceRequests.filter(r => r.equipmentId === id);

  const handleDelete = () => {
    if (id) {
      deleteEquipment(id);
      navigate('/equipment');
    }
  };

  if (!eq) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Equipment not found</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{eq.name}</h1>
          <p className="text-gray-600 mt-1">{eq.model} • {eq.serialNumber}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          eq.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {eq.status}
        </span>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => setShowEditDialog(true)}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button variant="destructive" size="icon" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full lg:w-auto grid grid-cols-5 lg:inline-grid">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{eq.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">{eq.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium">{eq.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{eq.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serial Number:</span>
                  <span className="font-medium">{eq.serialNumber}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Warranty & Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Purchase Date:</span>
                  <span className="font-medium">{new Date(eq.purchaseDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Warranty Expiry:</span>
                  <span className="font-medium">{new Date(eq.warrantyExpiry).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Maintenance:</span>
                  <span className="font-medium">{new Date(eq.lastMaintenance).toLocaleDateString()}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className={`text-sm ${
                    new Date(eq.warrantyExpiry) > new Date() ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {new Date(eq.warrantyExpiry) > new Date() ? '✓ Under Warranty' : '✗ Warranty Expired'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Files</CardTitle>
            </CardHeader>
            <CardContent>
              {eq.documents.length > 0 ? (
                <div className="grid gap-3">
                  {eq.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No documents available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance History Tab */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              {history.length > 0 ? (
                <div className="space-y-4">
                  {history.map((item) => {
                    const statusColors = {
                      'new': 'bg-blue-100 text-blue-700',
                      'in-progress': 'bg-orange-100 text-orange-700',
                      'repaired': 'bg-green-100 text-green-700',
                      'scrap': 'bg-red-100 text-red-700',
                    };

                    return (
                      <div key={item.id} className="border-l-4 border-blue-600 pl-4 py-2">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[item.status]}`}>
                            {item.status.replace('-', ' ')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Created: {new Date(item.createdDate).toLocaleDateString()}</span>
                          <span>Due: {new Date(item.dueDate).toLocaleDateString()}</span>
                          {item.assignedTo && <span>Assigned: {item.assignedTo}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No maintenance history</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teams Tab */}
        <TabsContent value="teams" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Teams</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Team management coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Reports coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <EditEquipmentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        equipment={eq || null}
      />
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the equipment
              {eq && ` "${eq.name}"`} from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
