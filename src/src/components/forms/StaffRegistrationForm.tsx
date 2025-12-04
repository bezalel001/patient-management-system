import { useState } from 'react';
import { X, Save, UserPlus } from 'lucide-react';
import { User } from '../../types';

interface StaffRegistrationFormProps {
  onClose: () => void;
  onSubmit: (data: Partial<User>) => void;
}

export function StaffRegistrationForm({ onClose, onSubmit }: StaffRegistrationFormProps) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'DOCTOR' as const,
    license_number: '',
    specialization: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate appropriate prefix for full name based on role
    let prefix = '';
    if (formData.role === 'DOCTOR') prefix = 'Dr. ';
    
    const staffData = {
      ...formData,
      username: `${formData.first_name.toLowerCase()}.${formData.last_name.toLowerCase()}`,
      full_name: `${prefix}${formData.first_name} ${formData.last_name}`,
      is_active: true,
    };
    
    onSubmit(staffData);
  };

  const requiresSpecialization = formData.role === 'DOCTOR';
  const requiresLicense = ['DOCTOR', 'NURSE', 'PHARMACIST', 'RADIOLOGIST', 'LAB_TECH'].includes(formData.role);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <UserPlus size={20} className="text-cyan-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Register Staff Member</h2>
              <p className="text-sm text-gray-600">Add a new staff member to the system</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <h3 className="text-gray-900 mb-4">Staff Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="John"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Smith"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="john.smith@hospital.com"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="DOCTOR">Doctor</option>
                  <option value="NURSE">Nurse</option>
                  <option value="LAB_TECH">Lab Technician</option>
                  <option value="PHARMACIST">Pharmacist</option>
                  <option value="RADIOLOGIST">Radiologist</option>
                  <option value="RECEPTIONIST">Receptionist</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              {requiresLicense && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="MD-12345, RN-67890, RPH-23456, etc."
                  />
                </div>
              )}

              {!requiresLicense && (
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="EMP-12345"
                  />
                </div>
              )}

              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Specialization / Department {requiresSpecialization && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required={requiresSpecialization}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder={
                    formData.role === 'DOCTOR' 
                      ? 'e.g., Cardiology, General Medicine' 
                      : formData.role === 'NURSE'
                      ? 'e.g., ICU, Pediatrics'
                      : 'e.g., Hematology, Biochemistry, etc.'
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Register Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
