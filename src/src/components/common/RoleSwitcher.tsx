import { UserCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../types';

interface RoleSwitcherProps {
  currentUser: User;
  onRoleChange: (role: User['role']) => void;
}

export function RoleSwitcher({ currentUser, onRoleChange }: RoleSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  const roles: { role: User['role']; label: string; description: string }[] = [
    { role: 'ADMIN', label: 'Admin', description: 'Full system access' },
    { role: 'DOCTOR', label: 'Doctor', description: 'Clinical management' },
    { role: 'NURSE', label: 'Nurse', description: 'Patient care' },
    { role: 'LAB_TECH', label: 'Lab Technician', description: 'Lab orders & results' },
    { role: 'PHARMACIST', label: 'Pharmacist', description: 'Medication dispensing' },
    { role: 'RADIOLOGIST', label: 'Radiologist', description: 'Radiology reports' },
    { role: 'RECEPTIONIST', label: 'Receptionist', description: 'Patient registration' },
  ];

  const currentRoleInfo = roles.find(r => r.role === currentUser.role);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <UserCircle size={18} className="text-gray-600" />
        <div className="text-left">
          <div className="text-sm text-gray-900">{currentRoleInfo?.label}</div>
          <div className="text-xs text-gray-500">Switch Role (Demo)</div>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="p-2">
              <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wide">
                Demo Mode - Select Role
              </div>
              {roles.map(({ role, label, description }) => (
                <button
                  key={role}
                  onClick={() => {
                    onRoleChange(role);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    currentUser.role === role
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="text-sm">{label}</div>
                  <div className="text-xs text-gray-500">{description}</div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
