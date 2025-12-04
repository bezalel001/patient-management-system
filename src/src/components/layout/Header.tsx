import { Bell, User, Search, Menu } from 'lucide-react';
import { User as UserType } from '../../types';

interface HeaderProps {
  user: UserType;
  onLogout: () => void;
  onMenuClick?: () => void;
}

export function Header({ user, onLogout, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile Menu Button */}
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg mr-2"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search patients by MRN, name, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-4 ml-auto">
          {/* Notification Bell */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          {/* User Info */}
          <div className="flex items-center gap-2 lg:gap-3 pl-2 lg:pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={20} />
              </button>
              
              <button
                onClick={onLogout}
                className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
                title="Logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="mt-4 md:hidden">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search patients..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </header>
  );
}