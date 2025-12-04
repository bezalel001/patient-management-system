import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { StaffRegistrationForm } from '../components/forms/StaffRegistrationForm';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Settings as SettingsIcon,
  Building,
  Bell,
  Lock
} from 'lucide-react';
import { User } from '../types';
import { toast } from 'sonner';

interface SettingsProps {
  currentUser: User;
}

// Mock staff data
const mockStaff: User[] = [
  {
    id: '1',
    username: 'dr_smith',
    email: 'smith@mediflow.com',
    first_name: 'John',
    last_name: 'Smith',
    full_name: 'Dr. John Smith',
    role: 'DOCTOR',
    license_number: 'MD-12345',
    specialization: 'General Medicine',
    is_active: true,
  },
  {
    id: '2',
    username: 'dr_wilson',
    email: 'wilson@mediflow.com',
    first_name: 'Sarah',
    last_name: 'Wilson',
    full_name: 'Dr. Sarah Wilson',
    role: 'DOCTOR',
    license_number: 'MD-12346',
    specialization: 'Cardiology',
    is_active: true,
  },
  {
    id: '3',
    username: 'nurse_jane',
    email: 'jane@mediflow.com',
    first_name: 'Jane',
    last_name: 'Doe',
    full_name: 'Jane Doe',
    role: 'NURSE',
    license_number: 'RN-45678',
    is_active: true,
  },
  {
    id: '4',
    username: 'labtech_mike',
    email: 'mike@mediflow.com',
    first_name: 'Mike',
    last_name: 'Johnson',
    full_name: 'Mike Johnson',
    role: 'LAB_TECH',
    license_number: 'LT-78901',
    is_active: true,
  },
  {
    id: '5',
    username: 'pharmacist_lisa',
    email: 'lisa@mediflow.com',
    first_name: 'Lisa',
    last_name: 'Chen',
    full_name: 'Lisa Chen',
    role: 'PHARMACIST',
    license_number: 'RPH-23456',
    is_active: true,
  },
];

export function Settings({ currentUser }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'hospital' | 'notifications' | 'security'>('staff');
  const [staff, setStaff] = useState<User[]>(mockStaff);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [showStaffForm, setShowStaffForm] = useState(false);

  const getRoleBadgeStatus = (role: string): 'success' | 'info' | 'warning' | 'error' => {
    switch (role) {
      case 'ADMIN':
        return 'error';
      case 'DOCTOR':
        return 'info';
      case 'NURSE':
        return 'success';
      case 'LAB_TECH':
      case 'PHARMACIST':
      case 'RADIOLOGIST':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getRoleLabel = (role: string): string => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrator',
      DOCTOR: 'Doctor',
      NURSE: 'Nurse',
      LAB_TECH: 'Lab Technician',
      PHARMACIST: 'Pharmacist',
      RADIOLOGIST: 'Radiologist',
      RECEPTIONIST: 'Receptionist',
    };
    return labels[role] || role;
  };

  const handleStaffSubmit = (staffData: Partial<User>) => {
    const newStaff: User = {
      ...staffData,
      id: (staff.length + 1).toString(),
      username: staffData.username || '',
      email: staffData.email || '',
      first_name: staffData.first_name || '',
      last_name: staffData.last_name || '',
      full_name: staffData.full_name || '',
      role: staffData.role || 'DOCTOR',
      is_active: true,
    } as User;
    
    setStaff([...staff, newStaff]);
    setShowStaffForm(false);
    toast.success('Staff member registered successfully!');
  };

  const filteredStaff = roleFilter === 'all' 
    ? staff 
    : staff.filter(s => s.role === roleFilter);

  const staffByRole = {
    ADMIN: staff.filter(s => s.role === 'ADMIN').length,
    DOCTOR: staff.filter(s => s.role === 'DOCTOR').length,
    NURSE: staff.filter(s => s.role === 'NURSE').length,
    LAB_TECH: staff.filter(s => s.role === 'LAB_TECH').length,
    PHARMACIST: staff.filter(s => s.role === 'PHARMACIST').length,
    RADIOLOGIST: staff.filter(s => s.role === 'RADIOLOGIST').length,
    RECEPTIONIST: staff.filter(s => s.role === 'RECEPTIONIST').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Settings</h2>
        <p className="text-gray-600">Manage system settings and staff</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('staff')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'staff'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users size={16} className="inline mr-2" />
          Staff Management
        </button>
        <button
          onClick={() => setActiveTab('hospital')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'hospital'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Building size={16} className="inline mr-2" />
          Hospital Info
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Bell size={16} className="inline mr-2" />
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Lock size={16} className="inline mr-2" />
          Security
        </button>
      </div>

      {/* Staff Management Tab */}
      {activeTab === 'staff' && (
        <>
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {Object.entries(staffByRole).map(([role, count]) => (
              <Card key={role}>
                <CardBody>
                  <div className="text-center">
                    <p className="text-2xl text-gray-900">{count}</p>
                    <p className="text-xs text-gray-600 mt-1">{getRoleLabel(role)}</p>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Actions and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  roleFilter === 'all'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Staff ({staff.length})
              </button>
              {Object.entries(staffByRole).filter(([_, count]) => count > 0).map(([role, count]) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                    roleFilter === role
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {getRoleLabel(role)} ({count})
                </button>
              ))}
            </div>

            <button 
              onClick={() => setShowStaffForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add Staff
            </button>
          </div>

          {/* Staff List */}
          <div className="space-y-3">
            {filteredStaff.map(member => (
              <Card key={member.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white">
                        {member.first_name[0]}{member.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">{member.full_name}</h4>
                          <Badge status={getRoleBadgeStatus(member.role)}>
                            {getRoleLabel(member.role)}
                          </Badge>
                          {member.is_active ? (
                            <Badge status="success">
                              <CheckCircle size={12} className="inline mr-1" />
                              Active
                            </Badge>
                          ) : (
                            <Badge status="error">
                              <XCircle size={12} className="inline mr-1" />
                              Inactive
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Mail size={14} />
                              {member.email}
                            </span>
                            {member.license_number && (
                              <span className="flex items-center gap-1">
                                <Shield size={14} />
                                {member.license_number}
                              </span>
                            )}
                          </div>
                          {member.specialization && (
                            <div>Specialization: {member.specialization}</div>
                          )}
                          <div className="text-xs text-gray-500">
                            Username: {member.username}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Hospital Info Tab */}
      {activeTab === 'hospital' && (
        <Card>
          <CardHeader>
            <h3 className="text-gray-900">Hospital Information</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    defaultValue="MediFlow General Hospital"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Registration Number</label>
                  <input
                    type="text"
                    defaultValue="HRN-2025-001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue="info@mediflow.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-600 mb-1">Address</label>
                  <input
                    type="text"
                    defaultValue="123 Medical Center Drive, Boston, MA 02101"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Email Notifications</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[
                  'New patient registrations',
                  'Critical lab results',
                  'Abnormal vital signs',
                  'Pending orders',
                  'System updates',
                ].map(item => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-gray-900">System Notifications</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[
                  'Browser notifications',
                  'Sound alerts',
                  'Desktop notifications',
                ].map(item => (
                  <div key={item} className="flex items-center justify-between py-2">
                    <span className="text-gray-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Password Policy</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {[
                  { label: 'Minimum password length', value: '8 characters' },
                  { label: 'Password expiry', value: '90 days' },
                  { label: 'Failed login attempts before lockout', value: '5 attempts' },
                  { label: 'Session timeout', value: '30 minutes' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="text-gray-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Audit Logs</h3>
            </CardHeader>
            <CardBody>
              <p className="text-gray-600 mb-4">
                System maintains comprehensive audit logs for HIPAA/GDPR compliance
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                View Audit Logs
              </button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Data Backup</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-2 text-gray-600">
                <p>Last backup: December 3, 2025 at 2:00 AM</p>
                <p>Backup frequency: Daily at 2:00 AM</p>
                <p>Retention period: 30 days</p>
              </div>
              <div className="mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Backup Now
                </button>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Staff Registration Form */}
      {showStaffForm && (
        <StaffRegistrationForm
          onClose={() => setShowStaffForm(false)}
          onSubmit={handleStaffSubmit}
        />
      )}
    </div>
  );
}
