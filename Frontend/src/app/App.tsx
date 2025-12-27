import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { EquipmentList } from './pages/EquipmentList';
import { EquipmentDetail } from './pages/EquipmentDetail';
import { Maintenance } from './pages/Maintenance';
import { MaintenanceDetail } from './pages/MaintenanceDetail';
import { Calendar } from './pages/Calendar';
import { Reports } from './pages/Reports';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { MobileHeader } from './components/layout/MobileHeader';

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <MobileHeader />
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
        <Route path="/equipment" element={<MainLayout><EquipmentList /></MainLayout>} />
        <Route path="/equipment/:id" element={<MainLayout><EquipmentDetail /></MainLayout>} />
        <Route path="/maintenance" element={<MainLayout><Maintenance /></MainLayout>} />
        <Route path="/maintenance/:id" element={<MainLayout><MaintenanceDetail /></MainLayout>} />
        <Route path="/calendar" element={<MainLayout><Calendar /></MainLayout>} />
        <Route path="/reports" element={<MainLayout><Reports /></MainLayout>} />
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
