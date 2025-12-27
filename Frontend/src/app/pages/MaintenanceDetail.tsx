import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, FileText, History, Users, BarChart, Download, Eye, Paperclip, Image as ImageIcon, Calendar, User, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { maintenanceRequests } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

export function MaintenanceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const request = maintenanceRequests.find(r => r.id === id);

  if (!request) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Maintenance request not found</p>
      </div>
    );
  }

  const statusColors = {
    'new': 'bg-blue-100 text-blue-700',
    'in-progress': 'bg-orange-100 text-orange-700',
    'repaired': 'bg-green-100 text-green-700',
    'scrap': 'bg-red-100 text-red-700',
  };

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const isOverdue = new Date(request.dueDate) < new Date() && request.status !== 'repaired' && request.status !== 'scrap';

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="mt-1">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">{request.title}</h1>
            <Badge className={statusColors[request.status]}>
              {request.status.replace('-', ' ')}
            </Badge>
            <Badge className={priorityColors[request.priority]}>
              {request.priority} priority
            </Badge>
          </div>
          <p className="text-gray-600">{request.equipmentName}</p>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Created</p>
                <p className="font-medium text-sm truncate">{new Date(request.createdDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isOverdue ? 'bg-red-100' : 'bg-green-100'}`}>
                <Calendar className={`w-5 h-5 ${isOverdue ? 'text-red-600' : 'text-green-600'}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-600">Due Date</p>
                <p className={`font-medium text-sm truncate ${isOverdue ? 'text-red-600' : ''}`}>
                  {new Date(request.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600">Assigned To</p>
                {request.assignedTo ? (
                  <div className="flex items-center gap-2 mt-1">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={request.assignedToAvatar} />
                      <AvatarFallback>{request.assignedTo[0]}</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm">{request.assignedTo}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Unassigned</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full lg:w-auto grid grid-cols-4 lg:inline-grid">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="attachments">
            Attachments
            {request.attachments.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-600 text-white rounded-full text-xs">
                {request.attachments.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Description</label>
                <p className="mt-1 text-gray-900">{request.description}</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm text-gray-600">Request ID</label>
                  <p className="mt-1 font-mono text-sm text-gray-900">{request.id}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Equipment ID</label>
                  <p className="mt-1 font-mono text-sm text-gray-900">{request.equipmentId}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Status</label>
                  <p className="mt-1">
                    <Badge className={statusColors[request.status]}>
                      {request.status.replace('-', ' ')}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Priority</label>
                  <p className="mt-1">
                    <Badge className={priorityColors[request.priority]}>
                      {request.priority}
                    </Badge>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {isOverdue && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-900">Overdue Request</p>
                    <p className="text-sm text-red-700 mt-1">
                      This maintenance request is past its due date. Please prioritize completion.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Attachments Tab */}
        <TabsContent value="attachments" className="space-y-6 mt-6">
          {/* Before Repair Images */}
          {request.beforeImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Before Repair Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {request.beforeImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt={`Before repair ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* After Repair Images */}
          {request.afterImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  After Repair Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {request.afterImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(img)}
                    >
                      <img src={img} alt={`After repair ${idx + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white opacity-0 hover:opacity-100" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Documents & Files */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paperclip className="w-5 h-5" />
                Documents & Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              {request.attachments.length > 0 ? (
                <div className="grid gap-3">
                  {request.attachments.map((attachment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{attachment}</p>
                          <p className="text-sm text-gray-500">Attached to maintenance request</p>
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
                <p className="text-center text-gray-500 py-8">No attachments available</p>
              )}
            </CardContent>
          </Card>

          {/* Report PDF */}
          {request.reportPdf && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Technician Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-blue-600 text-white rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.reportPdf}</p>
                      <p className="text-sm text-gray-500">Final technician assessment report</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="default">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      1
                    </div>
                    <div className="flex-1 w-0.5 bg-gray-200 my-2" style={{ minHeight: '40px' }} />
                  </div>
                  <div className="flex-1 pb-8">
                    <p className="font-medium text-gray-900">Request Created</p>
                    <p className="text-sm text-gray-600 mt-1">Initial maintenance request submitted</p>
                    <p className="text-xs text-gray-500 mt-2">{new Date(request.createdDate).toLocaleString()}</p>
                  </div>
                </div>

                {request.assignedTo && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
                        2
                      </div>
                      <div className="flex-1 w-0.5 bg-gray-200 my-2" style={{ minHeight: '40px' }} />
                    </div>
                    <div className="flex-1 pb-8">
                      <p className="font-medium text-gray-900">Assigned to Technician</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Assigned to {request.assignedTo}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Assigned shortly after creation</p>
                    </div>
                  </div>
                )}

                {request.status === 'in-progress' && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white">
                        3
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Work In Progress</p>
                      <p className="text-sm text-gray-600 mt-1">Technician is currently working on this request</p>
                      <p className="text-xs text-gray-500 mt-2">Status updated recently</p>
                    </div>
                  </div>
                )}

                {(request.status === 'repaired' || request.status === 'scrap') && (
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                        request.status === 'repaired' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        ✓
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {request.status === 'repaired' ? 'Repair Completed' : 'Marked as Scrap'}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {request.status === 'repaired' 
                          ? 'Equipment has been successfully repaired and is operational'
                          : 'Equipment deemed not economical to repair'
                        }
                      </p>
                      <p className="text-xs text-gray-500 mt-2">Completed recently</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Generate and download comprehensive reports for this maintenance request.
              </p>
              <div className="grid lg:grid-cols-2 gap-4">
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="flex items-center gap-3 w-full">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div className="text-left">
                      <p className="font-medium">Work Order Report</p>
                      <p className="text-xs text-gray-500 mt-0.5">Complete maintenance details</p>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4 justify-start">
                  <div className="flex items-center gap-3 w-full">
                    <BarChart className="w-5 h-5 text-green-600" />
                    <div className="text-left">
                      <p className="font-medium">Cost Analysis</p>
                      <p className="text-xs text-gray-500 mt-0.5">Parts and labor breakdown</p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="relative w-full">
              <img src={selectedImage} alt="Preview" className="w-full h-auto rounded-lg" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
