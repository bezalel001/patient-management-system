import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface MedicationOrderFormProps {
  visitId: string;
  visitNumber: string;
  onClose: () => void;
  onSubmit: (medications: any[]) => void;
}

interface MedicationItem {
  id: string;
  medication_name: string;
  dosage: string;
  route: 'ORAL' | 'IV' | 'IM' | 'SC' | 'TOPICAL' | 'INHALED';
  frequency: string;
  duration_days: number;
  instructions: string;
}

const commonMedications = [
  'Paracetamol',
  'Ibuprofen',
  'Amoxicillin',
  'Azithromycin',
  'Omeprazole',
  'Metformin',
  'Amlodipine',
  'Atorvastatin',
  'Aspirin',
  'Ciprofloxacin',
  'Ceftriaxone',
  'Dexamethasone',
  'Ranitidine',
  'Salbutamol',
  'Insulin',
];

const frequencies = [
  { value: 'OD', label: 'OD (Once daily)' },
  { value: 'BD', label: 'BD (Twice daily)' },
  { value: 'TID', label: 'TID (Three times daily)' },
  { value: 'QID', label: 'QID (Four times daily)' },
  { value: 'Q4H', label: 'Q4H (Every 4 hours)' },
  { value: 'Q6H', label: 'Q6H (Every 6 hours)' },
  { value: 'Q8H', label: 'Q8H (Every 8 hours)' },
  { value: 'Q12H', label: 'Q12H (Every 12 hours)' },
  { value: 'PRN', label: 'PRN (As needed)' },
  { value: 'STAT', label: 'STAT (Immediately)' },
];

export function MedicationOrderForm({ visitId, visitNumber, onClose, onSubmit }: MedicationOrderFormProps) {
  const [medications, setMedications] = useState<MedicationItem[]>([
    {
      id: '1',
      medication_name: '',
      dosage: '',
      route: 'ORAL',
      frequency: 'BD',
      duration_days: 5,
      instructions: '',
    },
  ]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const addMedication = () => {
    const newMed: MedicationItem = {
      id: Date.now().toString(),
      medication_name: '',
      dosage: '',
      route: 'ORAL',
      frequency: 'BD',
      duration_days: 5,
      instructions: '',
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof MedicationItem, value: any) => {
    setMedications(
      medications.map((med) =>
        med.id === id ? { ...med, [field]: value } : med
      )
    );
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    medications.forEach((med, index) => {
      if (!med.medication_name.trim()) {
        newErrors[`med_${index}_name`] = 'Medication name is required';
      }
      if (!med.dosage.trim()) {
        newErrors[`med_${index}_dosage`] = 'Dosage is required';
      }
      if (med.duration_days <= 0) {
        newErrors[`med_${index}_duration`] = 'Duration must be positive';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const medicationOrders = medications.map((med) => ({
      order_number: `MO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}`,
      visit: visitId,
      medication_name: med.medication_name,
      dosage: med.dosage,
      route: med.route,
      frequency: med.frequency,
      duration_days: med.duration_days,
      instructions: med.instructions,
      status: 'ACTIVE' as const,
      prescribed_at: new Date().toISOString(),
    }));

    onSubmit(medicationOrders);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Prescribe Medications</h2>
            <p className="text-gray-600">Visit: {visitNumber}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {medications.map((med, index) => (
            <div key={med.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-900">Medication {index + 1}</h3>
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedication(med.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Medication Name */}
                <div>
                  <label className="block text-gray-700 mb-2">Medication Name *</label>
                  <input
                    type="text"
                    list={`medications-${med.id}`}
                    value={med.medication_name}
                    onChange={(e) => updateMedication(med.id, 'medication_name', e.target.value)}
                    placeholder="Start typing or select..."
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`med_${index}_name`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  <datalist id={`medications-${med.id}`}>
                    {commonMedications.map((name) => (
                      <option key={name} value={name} />
                    ))}
                  </datalist>
                  {errors[`med_${index}_name`] && (
                    <p className="text-red-500 mt-1">{errors[`med_${index}_name`]}</p>
                  )}
                </div>

                {/* Dosage */}
                <div>
                  <label className="block text-gray-700 mb-2">Dosage *</label>
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                    placeholder="e.g., 500mg, 5ml, 1 tablet"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`med_${index}_dosage`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`med_${index}_dosage`] && (
                    <p className="text-red-500 mt-1">{errors[`med_${index}_dosage`]}</p>
                  )}
                </div>

                {/* Route */}
                <div>
                  <label className="block text-gray-700 mb-2">Route *</label>
                  <select
                    value={med.route}
                    onChange={(e) => updateMedication(med.id, 'route', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ORAL">Oral</option>
                    <option value="IV">Intravenous (IV)</option>
                    <option value="IM">Intramuscular (IM)</option>
                    <option value="SC">Subcutaneous (SC)</option>
                    <option value="TOPICAL">Topical</option>
                    <option value="INHALED">Inhaled</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="block text-gray-700 mb-2">Frequency *</label>
                  <select
                    value={med.frequency}
                    onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {frequencies.map((freq) => (
                      <option key={freq.value} value={freq.value}>
                        {freq.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-gray-700 mb-2">Duration (days) *</label>
                  <input
                    type="number"
                    value={med.duration_days}
                    onChange={(e) => updateMedication(med.id, 'duration_days', parseInt(e.target.value) || 0)}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`med_${index}_duration`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`med_${index}_duration`] && (
                    <p className="text-red-500 mt-1">{errors[`med_${index}_duration`]}</p>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-gray-700 mb-2">Instructions</label>
                <textarea
                  value={med.instructions}
                  onChange={(e) => updateMedication(med.id, 'instructions', e.target.value)}
                  placeholder="e.g., Take with food, Avoid alcohol, Take before bedtime..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          ))}

          {/* Add Medication Button */}
          <button
            type="button"
            onClick={addMedication}
            className="w-full px-4 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Another Medication
          </button>

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
              Prescribe {medications.length > 1 ? `${medications.length} Medications` : 'Medication'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
