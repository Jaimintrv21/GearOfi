import { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Link } from 'react-router-dom';
import { Plus, Calendar, User, Paperclip, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { maintenanceRequests as initialRequests, MaintenanceRequest } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
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
import { NewRequestDialog } from '../components/forms/NewRequestDialog';

const ITEM_TYPE = 'MAINTENANCE_CARD';

const statusColumns = [
  { id: 'new', title: 'New', color: 'bg-blue-100 border-blue-300' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-orange-100 border-orange-300' },
  { id: 'repaired', title: 'Repaired', color: 'bg-green-100 border-green-300' },
  { id: 'scrap', title: 'Scrap', color: 'bg-red-100 border-red-300' },
] as const;

interface DraggableCardProps {
  request: MaintenanceRequest;
  onMove: (id: string, newStatus: string) => void;
}

function DraggableCard({ request, onMove }: DraggableCardProps) {
  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { id: request.id, status: request.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const priorityColors = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-yellow-100 text-yellow-700',
    high: 'bg-red-100 text-red-700',
  };

  const isOverdue = new Date(request.dueDate) < new Date() && request.status !== 'repaired' && request.status !== 'scrap';

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg border p-4 shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-medium text-gray-900 line-clamp-2">{request.title}</h4>
          <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${priorityColors[request.priority]}`}>
            {request.priority}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{request.equipmentName}</p>

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar className="w-3 h-3" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {new Date(request.dueDate).toLocaleDateString()}
          </span>
          {isOverdue && <AlertCircle className="w-3 h-3 text-red-600" />}
        </div>

        {request.assignedTo && (
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={request.assignedToAvatar} />
              <AvatarFallback>{request.assignedTo[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-600">{request.assignedTo}</span>
          </div>
        )}

        {request.attachments.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Paperclip className="w-3 h-3" />
            <span>{request.attachments.length}</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface DroppableColumnProps {
  status: typeof statusColumns[number];
  requests: MaintenanceRequest[];
  onMove: (id: string, newStatus: string) => void;
}

function DroppableColumn({ status, requests, onMove }: DroppableColumnProps) {
  const [{ isOver }, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item: { id: string; status: string }) => {
      if (item.status !== status.id) {
        onMove(item.id, status.id);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="flex-1 min-w-0">
      <div className={`rounded-lg border-2 ${status.color} p-3 min-h-[600px]`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{status.title}</h3>
            <span className="px-2 py-0.5 bg-white rounded-full text-xs font-medium text-gray-700">
              {requests.length}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {requests.map((request) => (
            <Link key={request.id} to={`/maintenance/${request.id}`}>
              <DraggableCard request={request} onMove={onMove} />
            </Link>
          ))}

          {requests.length === 0 && (
            <div className={`p-8 text-center text-gray-400 border-2 border-dashed rounded-lg ${
              isOver ? 'border-gray-400 bg-white' : 'border-gray-200'
            }`}>
              {isOver ? 'Drop here' : 'No items'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Maintenance() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(initialRequests);
  const [showScrapDialog, setShowScrapDialog] = useState(false);
  const [pendingMove, setPendingMove] = useState<{ id: string; newStatus: string } | null>(null);
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);

  const handleMove = (id: string, newStatus: string) => {
    if (newStatus === 'scrap') {
      setPendingMove({ id, newStatus });
      setShowScrapDialog(true);
    } else {
      setRequests(prev =>
        prev.map(req => req.id === id ? { ...req, status: newStatus as any } : req)
      );
    }
  };

  const confirmScrap = () => {
    if (pendingMove) {
      setRequests(prev =>
        prev.map(req => req.id === pendingMove.id ? { ...req, status: 'scrap' as any } : req)
      );
      setShowScrapDialog(false);
      setPendingMove(null);
    }
  };

  const cancelScrap = () => {
    setShowScrapDialog(false);
    setPendingMove(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-4 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Maintenance Requests</h1>
            <p className="text-gray-600 mt-1">Manage and track all maintenance requests</p>
          </div>
          <Button className="w-full lg:w-auto" onClick={() => setShowNewRequestDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Request
          </Button>
        </div>

        {/* Desktop: Kanban Board */}
        <div className="hidden lg:flex lg:gap-4 lg:overflow-x-auto pb-4">
          {statusColumns.map((column) => (
            <DroppableColumn
              key={column.id}
              status={column}
              requests={requests.filter(r => r.status === column.id)}
              onMove={handleMove}
            />
          ))}
        </div>

        {/* Mobile: List View */}
        <div className="lg:hidden space-y-4">
          {statusColumns.map((column) => {
            const columnRequests = requests.filter(r => r.status === column.id);
            if (columnRequests.length === 0) return null;

            return (
              <Card key={column.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{column.title}</CardTitle>
                    <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium">
                      {columnRequests.length}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {columnRequests.map((request) => (
                    <Link key={request.id} to={`/maintenance/${request.id}`}>
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <DraggableCard request={request} onMove={handleMove} />
                      </div>
                    </Link>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Scrap Confirmation Dialog */}
        <AlertDialog open={showScrapDialog} onOpenChange={setShowScrapDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Scrap Status</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to mark this equipment as scrap? This action indicates the equipment cannot be repaired and should be disposed of.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={cancelScrap}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmScrap} className="bg-red-600 hover:bg-red-700">
                Mark as Scrap
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <NewRequestDialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog} />
      </div>
    </DndProvider>
  );
}