import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ScheduleMaintenanceDialog } from '../components/forms/ScheduleMaintenanceDialog';
import { api } from '../../services/api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [equipment, setEquipment] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([api.fetchEquipment(), api.fetchRequests()])
      .then(([eq, req]) => {
        setEquipment(eq);
        setRequests(req);
      })
      .catch(err => console.error("Failed to load calendar data", err));
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Generate calendar days
  const calendarDays = [];

  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
    });
  }

  // Next month days to fill the grid
  const remainingDays = 42 - calendarDays.length;
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push({
      day,
      isCurrentMonth: false,
      date: new Date(year, month + 1, day),
    });
  }

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get maintenance for a specific date
  const getMaintenanceForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];

    // Filter reqs
    const dailyRequests = requests.filter(r => {
      if (!r.scheduled_date) return false;
      return r.scheduled_date.startsWith(dateStr);
    });

    const preventive = dailyRequests.filter(r => r.req_type === 'Preventive');
    const regular = dailyRequests.filter(r => r.req_type === 'Corrective'); // Or others

    // Enrich with names
    const enrich = (list: any[]) => list.map(r => ({
      ...r,
      equipmentName: equipment.find(e => e.id === r.equipment_id)?.name || 'Unknown'
    }));

    return { preventive: enrich(preventive), regular: enrich(regular) };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const upcomingMaintenance = requests
    .filter(r => new Date(r.scheduled_date) >= new Date() && r.stage !== 'Repaired' && r.stage !== 'Scrap')
    .sort((a, b) => new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime())
    .slice(0, 5)
    .map(r => ({
      ...r,
      equipmentName: equipment.find(e => e.id === r.equipment_id)?.name
    }));

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Maintenance Calendar</h1>
          <p className="text-gray-600 mt-1">Schedule and track preventive maintenance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={goToToday}>
            Today
          </Button>
          <Button onClick={() => setShowScheduleDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Maintenance
          </Button>
        </div>
      </div>

      {/* View Toggle and Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
            {MONTHS[month]} {year}
          </h2>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Month
          </Button>
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {DAYS.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((calDay, idx) => {
              const { preventive, regular } = getMaintenanceForDate(calDay.date);
              const hasEvents = preventive.length > 0 || regular.length > 0;
              const isTodayDate = isToday(calDay.date);

              return (
                <div
                  key={idx}
                  className={`min-h-[80px] lg:min-h-[140px] p-2 border rounded-lg transition-colors overflow-y-auto ${!calDay.isCurrentMonth
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-white hover:bg-blue-50 cursor-pointer'
                    } ${isTodayDate ? 'ring-2 ring-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isTodayDate ? 'text-blue-600' : ''
                      }`}>
                      {calDay.day}
                    </span>
                    {hasEvents && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>

                  {calDay.isCurrentMonth && (
                    <div className="space-y-1">
                      {preventive.slice(0, 2).map((pm) => (
                        <div
                          key={pm.id}
                          className="text-xs p-1 rounded bg-green-100 text-green-700 truncate"
                          title={pm.subject}
                        >
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{pm.equipmentName}</span>
                          </div>
                        </div>
                      ))}

                      {regular.slice(0, 2).map((mr) => (
                        <div
                          key={mr.id}
                          className="text-xs p-1 rounded bg-orange-100 text-orange-700 truncate"
                          title={mr.subject}
                        >
                          <div className="flex items-center gap-1">
                            <Wrench className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{mr.equipmentName}</span>
                          </div>
                        </div>
                      ))}

                      {(preventive.length + regular.length) > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{(preventive.length + regular.length) - 2} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Maintenance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingMaintenance.length > 0 ? (
              <div className="space-y-3">
                {upcomingMaintenance.map((req) => (
                  <div key={req.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{req.subject}</h4>
                      <Badge className={
                        req.req_type === 'Preventive' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }>
                        {req.req_type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{req.equipmentName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(req.scheduled_date).toLocaleDateString()}
                      </span>
                      {req.technician_id && (
                        <span>Tech: #{req.technician_id}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No upcoming maintenance</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border border-green-300" />
              <span className="text-sm text-gray-700">Preventive Maintenance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border border-orange-300" />
              <span className="text-sm text-gray-700">Corrective/Regular</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded border-2 border-blue-600" />
              <span className="text-sm text-gray-700">Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Maintenance Dialog */}
      <ScheduleMaintenanceDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        preselectedDate={selectedDate}
      />
    </div>
  );
}