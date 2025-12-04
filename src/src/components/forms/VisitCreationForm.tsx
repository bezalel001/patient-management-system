import { useState } from 'react';
import { X, Save, ClipboardList, Search } from 'lucide-react';
import { Patient } from '../../types';

interface VisitCreationFormProps {
  patients: Patient[];
  onClose: () => void;
  onSubmit: (data: any) => void;
  preSelectedPatient?: Patient;
}

export function VisitCreationForm({ patients, onClose, onSubmit, preSelectedPatient }: VisitCreationFormProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(preSelectedPatient || null);
  const [formData, setFormData] = useState({
    visit_type: 'OPD',
    chief_complaint: '',
    history_of_present_illness: '',
    physical_examination: '',
    diagnosis: '',
    treatment_plan: '',
    bed_number: '',
    ward: '',
  });

  const filteredPatients = patients.filter(patient =>
    patient.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient) {
      alert('Please select a patient');
      return;
    }

    // Generate visit number
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    const visit_number = `VS-${year}-${random}`;
    
    const visitData = {
      ...formData,
      id: Math.random().toString(),
      visit_number,
      patient: selectedPatient.id,
      patient_details: {
        id: selectedPatient.id,
        mrn: selectedPatient.mrn,
        first_name: selectedPatient.first_name,
        last_name: selectedPatient.last_name,
        age: selectedPatient.age,
        gender: selectedPatient.gender,
        phone: selectedPatient.phone,
        created_at: selectedPatient.created_at,
      },
      admission_datetime: new Date().toISOString(),
      duration_days: 0,
      status: 'ACTIVE',
      assigned_doctors: [],
      assigned_nurses: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSubmit(visitData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <ClipboardList size={20} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Create New Visit</h2>
              <p className="text-sm text-gray-600">Start a new patient visit or encounter</p>
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
          {/* Patient Selection */}
          <div>
            <h3 className="text-gray-900 mb-4">Select Patient</h3>
            
            {!selectedPatient ? (
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by MRN, name, or phone..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map(patient => (
                      <button
                        key={patient.id}
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="w-full p-4 hover:bg-gray-50 border-b border-gray-100 last:border-0 text-left transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-900">
                              {patient.first_name} {patient.last_name}
                            </p>
                            <p className="text-sm text-gray-600">
                              MRN: {patient.mrn} • {patient.age} yrs • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                            </p>
                          </div>
                          <span className="text-sm text-blue-600">Select</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      No patients found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-900">
                      {selectedPatient.first_name} {selectedPatient.last_name}
                    </p>
                    <p className="text-sm text-gray-600">
                      MRN: {selectedPatient.mrn} • {selectedPatient.age} yrs • {selectedPatient.gender === 'M' ? 'Male' : selectedPatient.gender === 'F' ? 'Female' : 'Other'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedPatient(null)}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Visit Details */}
          {selectedPatient && (
            <>
              <div>
                <h3 className="text-gray-900 mb-4">Visit Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">
                      Visit Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="visit_type"
                      value={formData.visit_type}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="OPD">Outpatient (OPD)</option>
                      <option value="IPD">Inpatient (IPD)</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                  </div>

                  {formData.visit_type === 'IPD' && (
                    <>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Bed Number</label>
                        <input
                          type="text"
                          name="bed_number"
                          value={formData.bed_number}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="301"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Ward/Department</label>
                        <input
                          type="text"
                          name="ward"
                          value={formData.ward}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="General Ward"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Clinical Information */}
              <div>
                <h3 className="text-gray-900 mb-4">Clinical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Chief Complaint <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="chief_complaint"
                      value={formData.chief_complaint}
                      onChange={handleChange}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Patient's primary concern or reason for visit..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      History of Present Illness
                    </label>
                    <textarea
                      name="history_of_present_illness"
                      value={formData.history_of_present_illness}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Detailed history of current illness..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Physical Examination
                    </label>
                    <textarea
                      name="physical_examination"
                      value={formData.physical_examination}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Physical examination findings..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Provisional Diagnosis
                    </label>
                    <textarea
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Initial diagnosis or working diagnosis..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Treatment Plan
                    </label>
                    <textarea
                      name="treatment_plan"
                      value={formData.treatment_plan}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Proposed treatment and management plan..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Form Actions */}
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
              disabled={!selectedPatient}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} />
              Create Visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
