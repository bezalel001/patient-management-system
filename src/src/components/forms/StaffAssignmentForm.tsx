import { useState } from 'react';
import { X, Save, Users, Search } from 'lucide-react';
import { User } from '../../types';

interface StaffAssignmentFormProps {
  visitId: string;
  visitNumber: string;
  patientName: string;
  currentDoctors: string[];
  currentNurses: string[];
  availableDoctors: User[];
  availableNurses: User[];
  onClose: () => void;
  onSubmit: (visitId: string, doctorIds: string[], nurseIds: string[]) => void;
}

export function StaffAssignmentForm({
  visitId,
  visitNumber,
  patientName,
  currentDoctors,
  currentNurses,
  availableDoctors,
  availableNurses,
  onClose,
  onSubmit,
}: StaffAssignmentFormProps) {
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>(currentDoctors);
  const [selectedNurses, setSelectedNurses] = useState<string[]>(currentNurses);
  const [doctorSearch, setDoctorSearch] = useState('');
  const [nurseSearch, setNurseSearch] = useState('');

  const toggleDoctor = (doctorId: string) => {
    setSelectedDoctors(prev =>
      prev.includes(doctorId)
        ? prev.filter(id => id !== doctorId)
        : [...prev, doctorId]
    );
  };

  const toggleNurse = (nurseId: string) => {
    setSelectedNurses(prev =>
      prev.includes(nurseId)
        ? prev.filter(id => id !== nurseId)
        : [...prev, nurseId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(visitId, selectedDoctors, selectedNurses);
  };

  const filteredDoctors = availableDoctors.filter(doctor =>
    doctor.full_name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
    (doctor.specialization && doctor.specialization.toLowerCase().includes(doctorSearch.toLowerCase()))
  );

  const filteredNurses = availableNurses.filter(nurse =>
    nurse.full_name.toLowerCase().includes(nurseSearch.toLowerCase()) ||
    (nurse.specialization && nurse.specialization.toLowerCase().includes(nurseSearch.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Assign Care Team</h2>
              <p className="text-sm text-gray-600">
                Visit: {visitNumber} • Patient: {patientName}
              </p>
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
          {/* Doctors Section */}
          <div>
            <h3 className="text-gray-900 mb-3">Assign Doctors</h3>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={doctorSearch}
                  onChange={(e) => setDoctorSearch(e.target.value)}
                  placeholder="Search doctors by name or specialization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredDoctors.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredDoctors.map(doctor => (
                      <label
                        key={doctor.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDoctors.includes(doctor.id)}
                          onChange={() => toggleDoctor(doctor.id)}
                          className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900">{doctor.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {doctor.specialization} • {doctor.license_number}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No doctors found
                  </div>
                )}
              </div>

              {selectedDoctors.length > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedDoctors.length} doctor{selectedDoctors.length !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
          </div>

          {/* Nurses Section */}
          <div>
            <h3 className="text-gray-900 mb-3">Assign Nurses</h3>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={nurseSearch}
                  onChange={(e) => setNurseSearch(e.target.value)}
                  placeholder="Search nurses by name or specialization..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredNurses.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredNurses.map(nurse => (
                      <label
                        key={nurse.id}
                        className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedNurses.includes(nurse.id)}
                          onChange={() => toggleNurse(nurse.id)}
                          className="w-4 h-4 text-cyan-600 border-gray-300 rounded focus:ring-cyan-500"
                        />
                        <div className="flex-1">
                          <p className="text-gray-900">{nurse.full_name}</p>
                          <p className="text-sm text-gray-600">
                            {nurse.specialization || 'General Nursing'} • {nurse.license_number}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    No nurses found
                  </div>
                )}
              </div>

              {selectedNurses.length > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedNurses.length} nurse{selectedNurses.length !== 1 ? 's' : ''} selected
                </div>
              )}
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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Assign Care Team
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
