import { Link, useLocation } from 'react-router-dom';
import { Home, Package, Wrench, Calendar, FileText } from 'lucide-react';
import { cn } from '../ui/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Equipment', href: '/equipment', icon: Package },
  { name: 'Requests', href: '/maintenance', icon: Wrench },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Reports', href: '/reports', icon: FileText },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
      <nav className="flex items-center justify-around h-16">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-0',
                isActive ? 'text-blue-600' : 'text-gray-500'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
