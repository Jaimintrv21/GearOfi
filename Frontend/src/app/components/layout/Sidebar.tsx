import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Wrench, Calendar, FileText, Settings, LogOut } from 'lucide-react';
import { cn } from '../ui/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Equipment', href: '/equipment', icon: Package },
  { name: 'Maintenance', href: '/maintenance', icon: Wrench },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 h-16 border-b">
        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 text-white">
          <Wrench className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg text-gray-900">GearOfi</span>
          <span className="text-xs text-gray-500">Maintenance System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
            alt="Admin"
            className="w-10 h-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500">admin@gearofi.com</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
