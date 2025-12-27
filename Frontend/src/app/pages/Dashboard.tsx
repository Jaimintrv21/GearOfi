import { useEffect, useState } from 'react';
import { Package, Wrench, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { api } from '../../services/api';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [equipmentList, setEquipmentList] = useState<any[]>([]);
  const [requestList, setRequestList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [eq, req] = await Promise.all([
          api.fetchEquipment(),
          api.fetchRequests()
        ]);
        setEquipmentList(eq);
        setRequestList(req);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="p-8">Loading Dashboard...</div>;

  const totalEquipment = equipmentList.length;
  // Backend uses 'state' instead of 'status'
  const openRequests = requestList.filter((r: any) => r.state !== 'repaired' && r.state !== 'scrap').length;
  const overdueRequests = requestList.filter((r: any) => {
    if(!r.scheduled_date) return false;
    const dueDate = new Date(r.scheduled_date);
    return dueDate < new Date() && r.state !== 'repaired' && r.state !== 'scrap';
  }).length;
  const preventiveToday = 0; // Backend doesn't support 'today' filter yet easily

  const stats = [
    {
      title: 'Total Equipment',
      value: totalEquipment,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Open Requests',
      value: openRequests,
      icon: Wrench,
      color: 'bg-orange-100 text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Overdue Requests',
      value: overdueRequests,
      icon: AlertCircle,
      color: 'bg-red-100 text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Preventive Today',
      value: preventiveToday,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const recentActivities = requestList.slice(0, 5);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your maintenance operations</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 lg:p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Link to="/maintenance">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-lg">
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View Maintenance Board</p>
                  <p className="text-sm text-gray-600">Manage all requests</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link to="/equipment">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 text-white rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Equipment List</p>
                  <p className="text-sm text-gray-600">View all equipment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {recentActivities.map((activity: any) => {
              const statusColors: any = {
                'new': 'bg-blue-100 text-blue-700',
                'in_progress': 'bg-orange-100 text-orange-700',
                'repaired': 'bg-green-100 text-green-700',
                'scrap': 'bg-red-100 text-red-700',
              };

              // Backend field mapping
              const displayStatus = activity.state || 'new';
              
              return (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg mt-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900">{activity.subject || activity.title}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[displayStatus] || ''}`}>
                          {displayStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Equipment ID: {activity.equipment_id}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Created: {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : 'N/A'}</span>
                        {activity.technician && (
                          <>
                            <span>•</span>
                            <span>Assigned to: {activity.technician}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
