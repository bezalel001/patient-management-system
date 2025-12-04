import { useState } from 'react';
import { X, Save, Activity } from 'lucide-react';

interface VitalsRecordingFormProps {
  visitId: string;
  visitNumber: string;
  patientName: string;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export function VitalsRecordingForm({ visitId, visitNumber, patientName, onClose, onSubmit }: VitalsRecordingFormProps) {
  const [formData, setFormData] = useState({
    temperature_celsius: '',
    systolic_bp: '',
    diastolic_bp: '',
    heart_rate: '',
    respiratory_rate: '',
    oxygen_saturation: '',
    weight_kg: '',
    height_cm: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight_kg);
    const height = parseFloat(formData.height_cm) / 100; // convert to meters
    
    if (weight && height) {
      return (weight / (height * height)).toFixed(1);
    }
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const bmi = calculateBMI();
    
    const vitalsData = {
      id: Math.random().toString(),
      visit: visitId,
      temperature_celsius: parseFloat(formData.temperature_celsius) || undefined,
      systolic_bp: parseInt(formData.systolic_bp) || undefined,
      diastolic_bp: parseInt(formData.diastolic_bp) || undefined,
      heart_rate: parseInt(formData.heart_rate) || undefined,
      respiratory_rate: parseInt(formData.respiratory_rate) || undefined,
      oxygen_saturation: parseInt(formData.oxygen_saturation) || undefined,
      weight_kg: parseFloat(formData.weight_kg) || undefined,
      height_cm: parseFloat(formData.height_cm) || undefined,
      bmi: bmi ? parseFloat(bmi) : undefined,
      notes: formData.notes || undefined,
      recorded_by: '1',
      recorded_by_name: 'Current User',
      recorded_at: new Date().toISOString(),
    };
    
    onSubmit(vitalsData);
  };

  const bmi = calculateBMI();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-gray-900">Record Vital Signs</h2>
              <p className="text-sm text-gray-600">{patientName} • {visitNumber}</p>
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
          {/* Vital Signs */}
          <div>
            <h3 className="text-gray-900 mb-4">Basic Vital Signs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="temperature_celsius"
                  value={formData.temperature_celsius}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="37.0"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 36.1-37.2°C</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="72"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 60-100 bpm</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Blood Pressure - Systolic (mmHg)
                </label>
                <input
                  type="number"
                  name="systolic_bp"
                  value={formData.systolic_bp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="120"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 90-120 mmHg</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Blood Pressure - Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  name="diastolic_bp"
                  value={formData.diastolic_bp}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="80"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 60-80 mmHg</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Respiratory Rate (breaths/min)
                </label>
                <input
                  type="number"
                  name="respiratory_rate"
                  value={formData.respiratory_rate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="16"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 12-20/min</p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  name="oxygen_saturation"
                  value={formData.oxygen_saturation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="98"
                />
                <p className="text-xs text-gray-500 mt-1">Normal: 95-100%</p>
              </div>
            </div>
          </div>

          {/* Measurements */}
          <div>
            <h3 className="text-gray-900 mb-4">Body Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="70.0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="170.0"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  BMI (calculated)
                </label>
                <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  {bmi || '—'}
                </div>
                {bmi && (
                  <p className="text-xs text-gray-500 mt-1">
                    {parseFloat(bmi) < 18.5 ? 'Underweight' :
                     parseFloat(bmi) < 25 ? 'Normal' :
                     parseFloat(bmi) < 30 ? 'Overweight' : 'Obese'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any additional observations or notes..."
            />
          </div>

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
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Save size={18} />
              Save Vitals
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
