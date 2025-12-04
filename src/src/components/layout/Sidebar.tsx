import { Home, Users, Clipboard, Activity, TestTube, FileText, DollarSign, Settings, Package, BarChart3, X, Calendar } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ currentPage, onNavigate, userRole, isOpen = true, onClose }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, roles: ['all'] },
    { id: 'patients', label: 'Patients', icon: Users, roles: ['all'] },
    { id: 'visits', label: 'Visits', icon: Clipboard, roles: ['DOCTOR', 'NURSE', 'RECEPTIONIST', 'ADMIN'] },
    { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['all'] },
    { id: 'orders', label: 'Orders', icon: Package, roles: ['DOCTOR', 'NURSE', 'LAB_TECH', 'PHARMACIST', 'RADIOLOGIST', 'ADMIN'] },
    { id: 'vitals', label: 'Vitals', icon: Activity, roles: ['DOCTOR', 'NURSE', 'ADMIN'] },
    { id: 'reports', label: 'Reports', icon: BarChart3, roles: ['DOCTOR', 'ADMIN'] },
    { id: 'billing', label: 'Billing', icon: DollarSign, roles: ['RECEPTIONIST', 'ADMIN'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['ADMIN'] },
  ];

  const filteredMenuItems = menuItems.filter(
    item => item.roles.includes('all') || item.roles.includes(userRole)
  );

  const handleNavigate = (page: string) => {
    onNavigate(page);
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-6 py-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-blue-600">MediFlow</h1>
            <p className="text-gray-500 text-sm mt-1">Hospital Management</p>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {filteredMenuItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="px-6 py-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">Version 1.0.0</p>
        </div>
      </aside>
    </>
  );
}