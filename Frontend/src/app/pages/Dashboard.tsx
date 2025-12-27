import { Package, Wrench, AlertCircle, CheckCircle, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { maintenanceRequests, equipment } from '../data/mockData';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const totalEquipment = equipment.filter(e => e.status === 'active').length;
  const openRequests = maintenanceRequests.filter(r => r.status !== 'repaired' && r.status !== 'scrap').length;
  const overdueRequests = maintenanceRequests.filter(r => {
    const dueDate = new Date(r.dueDate);
    return dueDate < new Date() && r.status !== 'repaired' && r.status !== 'scrap';
  }).length;
  const preventiveToday = 2;

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

  const recentActivities = maintenanceRequests.slice(0, 5);

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

        <Link to="/reports">
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-purple-200 bg-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 text-white rounded-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">Analytics & insights</p>
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
            {recentActivities.map((activity) => {
              const statusColors = {
                'new': 'bg-blue-100 text-blue-700',
                'in-progress': 'bg-orange-100 text-orange-700',
                'repaired': 'bg-green-100 text-green-700',
                'scrap': 'bg-red-100 text-red-700',
              };

              return (
                <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg mt-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-gray-900">{activity.title}</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[activity.status]}`}>
                          {activity.status.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.equipmentName}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Created: {new Date(activity.createdDate).toLocaleDateString()}</span>
                        {activity.assignedTo && (
                          <>
                            <span>•</span>
                            <span>Assigned to: {activity.assignedTo}</span>
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
