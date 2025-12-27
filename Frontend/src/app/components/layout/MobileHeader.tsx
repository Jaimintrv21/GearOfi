import { Wrench, Bell, Menu } from 'lucide-react';

export function MobileHeader() {
  return (
    <div className="lg:hidden sticky top-0 z-40 bg-white border-b">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white">
            <Wrench className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-gray-900">GearOfi</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
