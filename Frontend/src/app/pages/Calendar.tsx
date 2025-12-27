import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { preventiveMaintenanceSchedule, maintenanceRequests } from '../data/mockData';
import { Badge } from '../components/ui/badge';
import { ScheduleMaintenanceDialog } from '../components/forms/ScheduleMaintenanceDialog';

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
    
    const preventive = preventiveMaintenanceSchedule.filter(pm => 
      pm.scheduledDate === dateStr
    );
    
    const regular = maintenanceRequests.filter(mr => 
      mr.dueDate === dateStr
    );
    
    return { preventive, regular };
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

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
                  className={`min-h-[80px] lg:min-h-[120px] p-2 border rounded-lg transition-colors ${
                    !calDay.isCurrentMonth
                      ? 'bg-gray-50 text-gray-400'
                      : 'bg-white hover:bg-blue-50 cursor-pointer'
                  } ${isTodayDate ? 'ring-2 ring-blue-600' : ''}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      isTodayDate ? 'text-blue-600' : ''
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
                          title={pm.title}
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
                          title={mr.title}
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
              <CalendarIcon className="w-5 h-5 text-green-600" />
              Preventive Maintenance Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {preventiveMaintenanceSchedule.length > 0 ? (
              <div className="space-y-3">
                {preventiveMaintenanceSchedule.map((pm) => (
                  <div key={pm.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{pm.title}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {pm.frequency}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pm.equipmentName}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="w-3 h-3" />
                        {new Date(pm.scheduledDate).toLocaleDateString()}
                      </span>
                      {pm.assignedTo && (
                        <span>Assigned: {pm.assignedTo}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No preventive maintenance scheduled</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Upcoming Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {maintenanceRequests
              .filter(mr => new Date(mr.dueDate) >= new Date() && mr.status !== 'repaired' && mr.status !== 'scrap')
              .slice(0, 5)
              .length > 0 ? (
              <div className="space-y-3">
                {maintenanceRequests
                  .filter(mr => new Date(mr.dueDate) >= new Date() && mr.status !== 'repaired' && mr.status !== 'scrap')
                  .slice(0, 5)
                  .map((mr) => {
                    const statusColors = {
                      'new': 'bg-blue-100 text-blue-700',
                      'in-progress': 'bg-orange-100 text-orange-700',
                      'repaired': 'bg-green-100 text-green-700',
                      'scrap': 'bg-red-100 text-red-700',
                    };

                    return (
                      <div key={mr.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{mr.title}</h4>
                          <Badge className={statusColors[mr.status]}>
                            {mr.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{mr.equipmentName}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            Due: {new Date(mr.dueDate).toLocaleDateString()}
                          </span>
                          {mr.assignedTo && (
                            <span>Assigned: {mr.assignedTo}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No upcoming maintenance requests</p>
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
              <span className="text-sm text-gray-700">Maintenance Request</span>
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