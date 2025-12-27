import { Download, Filter, TrendingUp, Wrench, DollarSign, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { equipment, maintenanceRequests } from '../data/mockData';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useState } from 'react';

const STATUS_COLORS = {
  new: '#3b82f6',
  'in-progress': '#f97316',
  repaired: '#22c55e',
  scrap: '#ef4444',
};

const PRIORITY_COLORS = {
  low: '#9ca3af',
  medium: '#eab308',
  high: '#ef4444',
};

export function Reports() {
  const [dateRange, setDateRange] = useState('last-30-days');

  // Calculate statistics
  const totalEquipment = equipment.length;
  const activeEquipment = equipment.filter(e => e.status === 'active').length;
  const totalRequests = maintenanceRequests.length;
  const completedRequests = maintenanceRequests.filter(r => r.status === 'repaired').length;

  // Status distribution data
  const statusData = [
    { name: 'New', value: maintenanceRequests.filter(r => r.status === 'new').length, color: STATUS_COLORS.new },
    { name: 'In Progress', value: maintenanceRequests.filter(r => r.status === 'in-progress').length, color: STATUS_COLORS['in-progress'] },
    { name: 'Repaired', value: maintenanceRequests.filter(r => r.status === 'repaired').length, color: STATUS_COLORS.repaired },
    { name: 'Scrap', value: maintenanceRequests.filter(r => r.status === 'scrap').length, color: STATUS_COLORS.scrap },
  ];

  // Priority distribution
  const priorityData = [
    { name: 'Low', value: maintenanceRequests.filter(r => r.priority === 'low').length, color: PRIORITY_COLORS.low },
    { name: 'Medium', value: maintenanceRequests.filter(r => r.priority === 'medium').length, color: PRIORITY_COLORS.medium },
    { name: 'High', value: maintenanceRequests.filter(r => r.priority === 'high').length, color: PRIORITY_COLORS.high },
  ];

  // Equipment category distribution
  const categoryData = equipment.reduce((acc: any[], eq) => {
    const existing = acc.find(item => item.name === eq.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: eq.category, count: 1 });
    }
    return acc;
  }, []);

  // Monthly maintenance trend (mock data)
  const monthlyTrendData = [
    { month: 'Jul', requests: 12, completed: 10, cost: 4500 },
    { month: 'Aug', requests: 15, completed: 14, cost: 5200 },
    { month: 'Sep', requests: 18, completed: 16, cost: 6100 },
    { month: 'Oct', requests: 14, completed: 13, cost: 4800 },
    { month: 'Nov', requests: 16, completed: 15, cost: 5500 },
    { month: 'Dec', requests: 20, completed: 12, cost: 7200 },
  ];

  // Equipment-wise maintenance count
  const equipmentMaintenanceData = equipment.map(eq => ({
    name: eq.name,
    requests: maintenanceRequests.filter(r => r.equipmentId === eq.id).length,
  })).filter(item => item.requests > 0).slice(0, 5);

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Maintenance performance insights and metrics</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7-days">Last 7 days</SelectItem>
              <SelectItem value="last-30-days">Last 30 days</SelectItem>
              <SelectItem value="last-90-days">Last 90 days</SelectItem>
              <SelectItem value="this-year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Equipment</p>
                <p className="text-3xl font-bold text-gray-900">{totalEquipment}</p>
                <p className="text-xs text-green-600 mt-1">
                  {activeEquipment} active
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{totalRequests}</p>
                <p className="text-xs text-orange-600 mt-1">
                  {totalRequests - completedRequests} pending
                </p>
              </div>
              <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                <Wrench className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-3xl font-bold text-gray-900">{completedRequests}</p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round((completedRequests / totalRequests) * 100)}% completion
                </p>
              </div>
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Resolution</p>
                <p className="text-3xl font-bold text-gray-900">4.2</p>
                <p className="text-xs text-gray-600 mt-1">days</p>
              </div>
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="requests" stroke="#3b82f6" strokeWidth={2} name="Requests" />
                <Line type="monotone" dataKey="completed" stroke="#22c55e" strokeWidth={2} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Equipment-wise Maintenance */}
        <Card>
          <CardHeader>
            <CardTitle>Maintenance by Equipment (Top 5)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={equipmentMaintenanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#3b82f6" name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Maintenance Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Bar dataKey="cost" fill="#22c55e" name="Cost ($)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Equipment Details Table */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Maintenance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-900">Equipment</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Location</th>
                  <th className="text-center p-3 font-semibold text-gray-900">Requests</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Last Maintenance</th>
                  <th className="text-center p-3 font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {equipment.map((eq) => {
                  const requestCount = maintenanceRequests.filter(r => r.equipmentId === eq.id).length;
                  return (
                    <tr key={eq.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <p className="font-medium text-gray-900">{eq.name}</p>
                          <p className="text-sm text-gray-500">{eq.model}</p>
                        </div>
                      </td>
                      <td className="p-3 text-gray-700">{eq.category}</td>
                      <td className="p-3 text-gray-700">{eq.location}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {requestCount}
                        </span>
                      </td>
                      <td className="p-3 text-gray-700">
                        {new Date(eq.lastMaintenance).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          eq.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {eq.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3 w-full">
                <Download className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium">Equipment Report</p>
                  <p className="text-xs text-gray-500 mt-0.5">Complete equipment list with maintenance history</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3 w-full">
                <Download className="w-5 h-5 text-green-600" />
                <div className="text-left">
                  <p className="font-medium">Cost Analysis</p>
                  <p className="text-xs text-gray-500 mt-0.5">Maintenance cost breakdown and trends</p>
                </div>
              </div>
            </Button>
            
            <Button variant="outline" className="h-auto p-4 justify-start">
              <div className="flex items-center gap-3 w-full">
                <Download className="w-5 h-5 text-orange-600" />
                <div className="text-left">
                  <p className="font-medium">Performance Report</p>
                  <p className="text-xs text-gray-500 mt-0.5">Technician performance and efficiency metrics</p>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
