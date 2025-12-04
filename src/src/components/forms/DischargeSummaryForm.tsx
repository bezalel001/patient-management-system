import { useState } from 'react';
import { X } from 'lucide-react';
import { Visit } from '../../types';

interface DischargeSummaryFormProps {
  visit: Visit;
  onClose: () => void;
  onSubmit: (summaryData: any) => void;
}

export function DischargeSummaryForm({ visit, onClose, onSubmit }: DischargeSummaryFormProps) {
  const [formData, setFormData] = useState({
    discharge_date: new Date().toISOString().slice(0, 16),
    final_diagnosis: visit.diagnosis || '',
    hospital_course: '',
    procedures_performed: '',
    discharge_medications: '',
    follow_up_instructions: '',
    diet_restrictions: '',
    activity_restrictions: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.discharge_date) {
      newErrors.discharge_date = 'Discharge date and time is required';
    }
    if (!formData.final_diagnosis.trim()) {
      newErrors.final_diagnosis = 'Final diagnosis is required';
    }
    if (!formData.hospital_course.trim()) {
      newErrors.hospital_course = 'Hospital course is required';
    }
    if (!formData.discharge_medications.trim()) {
      newErrors.discharge_medications = 'Discharge medications are required';
    }
    if (!formData.follow_up_instructions.trim()) {
      newErrors.follow_up_instructions = 'Follow-up instructions are required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const summaryData = {
      visit: visit.id,
      visit_number: visit.visit_number,
      patient_name: visit.patient_details 
        ? `${visit.patient_details.first_name} ${visit.patient_details.last_name}`
        : '',
      admission_date: visit.admission_datetime,
      ...formData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onSubmit(summaryData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Discharge Summary</h2>
            <p className="text-gray-600">
              Visit: {visit.visit_number} • Patient: {visit.patient_details?.first_name} {visit.patient_details?.last_name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Visit Info Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-600">Admission Date:</span>
                <p className="text-gray-900">
                  {new Date(visit.admission_datetime).toLocaleString()}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Visit Type:</span>
                <p className="text-gray-900">{visit.visit_type}</p>
              </div>
              {visit.ward && (
                <div>
                  <span className="text-gray-600">Ward:</span>
                  <p className="text-gray-900">{visit.ward}</p>
                </div>
              )}
              {visit.bed_number && (
                <div>
                  <span className="text-gray-600">Bed:</span>
                  <p className="text-gray-900">{visit.bed_number}</p>
                </div>
              )}
            </div>
          </div>

          {/* Discharge Date & Time */}
          <div>
            <label className="block text-gray-700 mb-2">Discharge Date & Time *</label>
            <input
              type="datetime-local"
              value={formData.discharge_date}
              onChange={(e) => handleChange('discharge_date', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.discharge_date ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.discharge_date && (
              <p className="text-red-500 mt-1">{errors.discharge_date}</p>
            )}
          </div>

          {/* Final Diagnosis */}
          <div>
            <label className="block text-gray-700 mb-2">Final Diagnosis *</label>
            <textarea
              value={formData.final_diagnosis}
              onChange={(e) => handleChange('final_diagnosis', e.target.value)}
              placeholder="Complete diagnosis at discharge..."
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.final_diagnosis ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.final_diagnosis && (
              <p className="text-red-500 mt-1">{errors.final_diagnosis}</p>
            )}
          </div>

          {/* Hospital Course */}
          <div>
            <label className="block text-gray-700 mb-2">Hospital Course *</label>
            <textarea
              value={formData.hospital_course}
              onChange={(e) => handleChange('hospital_course', e.target.value)}
              placeholder="Brief summary of patient's hospital stay, treatment received, response to treatment, complications if any..."
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.hospital_course ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.hospital_course && (
              <p className="text-red-500 mt-1">{errors.hospital_course}</p>
            )}
          </div>

          {/* Procedures Performed */}
          <div>
            <label className="block text-gray-700 mb-2">Procedures Performed</label>
            <textarea
              value={formData.procedures_performed}
              onChange={(e) => handleChange('procedures_performed', e.target.value)}
              placeholder="List any procedures, surgeries, or interventions performed during hospital stay..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Discharge Medications */}
          <div>
            <label className="block text-gray-700 mb-2">Discharge Medications *</label>
            <textarea
              value={formData.discharge_medications}
              onChange={(e) => handleChange('discharge_medications', e.target.value)}
              placeholder="List all medications patient should continue at home with dosage and frequency..."
              rows={5}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.discharge_medications ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.discharge_medications && (
              <p className="text-red-500 mt-1">{errors.discharge_medications}</p>
            )}
          </div>

          {/* Follow-up Instructions */}
          <div>
            <label className="block text-gray-700 mb-2">Follow-up Instructions *</label>
            <textarea
              value={formData.follow_up_instructions}
              onChange={(e) => handleChange('follow_up_instructions', e.target.value)}
              placeholder="When and where patient should follow up, what to monitor, when to seek emergency care..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.follow_up_instructions ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.follow_up_instructions && (
              <p className="text-red-500 mt-1">{errors.follow_up_instructions}</p>
            )}
          </div>

          {/* Diet Restrictions */}
          <div>
            <label className="block text-gray-700 mb-2">Diet Restrictions</label>
            <textarea
              value={formData.diet_restrictions}
              onChange={(e) => handleChange('diet_restrictions', e.target.value)}
              placeholder="Any dietary modifications or restrictions patient should follow..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Activity Restrictions */}
          <div>
            <label className="block text-gray-700 mb-2">Activity Restrictions</label>
            <textarea
              value={formData.activity_restrictions}
              onChange={(e) => handleChange('activity_restrictions', e.target.value)}
              placeholder="Any physical activity limitations or restrictions patient should follow..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Complete Discharge
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
