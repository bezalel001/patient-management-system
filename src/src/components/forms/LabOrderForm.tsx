import { useState } from 'react';
import { X } from 'lucide-react';

interface LabOrderFormProps {
  visitId: string;
  visitNumber: string;
  onClose: () => void;
  onSubmit: (orderData: any) => void;
}

const commonLabTests = [
  { category: 'Hematology', tests: ['Complete Blood Count (CBC)', 'ESR', 'Hemoglobin', 'Platelet Count', 'Peripheral Smear'] },
  { category: 'Biochemistry', tests: ['Lipid Profile', 'Liver Function Test (LFT)', 'Kidney Function Test (KFT)', 'Fasting Blood Sugar', 'HbA1c', 'Serum Electrolytes'] },
  { category: 'Microbiology', tests: ['Blood Culture', 'Urine Culture', 'Sputum Culture', 'Wound Swab', 'Stool Culture'] },
  { category: 'Immunology', tests: ['HIV Test', 'Hepatitis Panel', 'Thyroid Profile', 'Vitamin D', 'Vitamin B12'] },
  { category: 'Urine Analysis', tests: ['Routine Urine Examination', 'Urine Protein', 'Urine Microalbumin', '24hr Urine Protein'] },
  { category: 'Serology', tests: ['Dengue NS1', 'Malaria Test', 'Widal Test', 'C-Reactive Protein (CRP)', 'Rheumatoid Factor'] },
];

export function LabOrderForm({ visitId, visitNumber, onClose, onSubmit }: LabOrderFormProps) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [testName, setTestName] = useState('');
  const [priority, setPriority] = useState<'ROUTINE' | 'URGENT' | 'STAT'>('ROUTINE');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setTestName('');
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!testName.trim()) {
      newErrors.testName = 'Test name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const orderData = {
      order_number: `LO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}`,
      visit: visitId,
      test_name: testName,
      test_category: selectedCategory || 'General',
      clinical_notes: clinicalNotes,
      status: 'PENDING' as const,
      priority,
      ordered_at: new Date().toISOString(),
    };

    onSubmit(orderData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900">Order Lab Test</h2>
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
          {/* Priority */}
          <div>
            <label className="block text-gray-700 mb-2">Priority *</label>
            <div className="flex gap-3">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="ROUTINE"
                  checked={priority === 'ROUTINE'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">Routine</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="URGENT"
                  checked={priority === 'URGENT'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">Urgent</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="STAT"
                  checked={priority === 'STAT'}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="mr-2"
                />
                <span className="text-gray-700">STAT</span>
              </label>
            </div>
          </div>

          {/* Test Category */}
          <div>
            <label className="block text-gray-700 mb-2">Test Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category...</option>
              {commonLabTests.map((cat) => (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          </div>

          {/* Test Name */}
          <div>
            <label className="block text-gray-700 mb-2">Test Name *</label>
            {selectedCategory ? (
              <select
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.testName ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a test...</option>
                {commonLabTests
                  .find((cat) => cat.category === selectedCategory)
                  ?.tests.map((test) => (
                    <option key={test} value={test}>
                      {test}
                    </option>
                  ))}
              </select>
            ) : (
              <input
                type="text"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="Enter test name or select a category first"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.testName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            )}
            {errors.testName && (
              <p className="text-red-500 mt-1">{errors.testName}</p>
            )}
          </div>

          {/* Clinical Notes */}
          <div>
            <label className="block text-gray-700 mb-2">Clinical Notes</label>
            <textarea
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Clinical indication, suspected diagnosis, relevant history..."
              rows={4}
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
              Order Test
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
