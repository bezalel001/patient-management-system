import { useState } from 'react';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { LabOrder, Visit, LabResult } from '../../types';

interface LabResultFormProps {
  order: LabOrder;
  visit: Visit;
  onClose: () => void;
  onSubmit: (results: LabResult[]) => void;
}

export function LabResultForm({ order, visit, onClose, onSubmit }: LabResultFormProps) {
  const [results, setResults] = useState<Partial<LabResult>[]>(
    order.results && order.results.length > 0
      ? order.results
      : [
          {
            parameter_name: '',
            result_value: '',
            unit: '',
            reference_range: '',
            is_abnormal: false,
            notes: '',
          },
        ]
  );

  const addParameter = () => {
    setResults([
      ...results,
      {
        parameter_name: '',
        result_value: '',
        unit: '',
        reference_range: '',
        is_abnormal: false,
        notes: '',
      },
    ]);
  };

  const removeParameter = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const updateParameter = (index: number, field: keyof LabResult, value: any) => {
    const newResults = [...results];
    newResults[index] = { ...newResults[index], [field]: value };
    setResults(newResults);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all parameters have required fields
    const isValid = results.every(
      r => r.parameter_name && r.result_value && r.unit && r.reference_range !== undefined
    );

    if (!isValid) {
      alert('Please fill in all required fields for each parameter');
      return;
    }

    const completeResults: LabResult[] = results.map((r, index) => ({
      id: r.id || `result-${Date.now()}-${index}`,
      parameter_name: r.parameter_name!,
      result_value: r.result_value!,
      unit: r.unit!,
      reference_range: r.reference_range!,
      is_abnormal: r.is_abnormal || false,
      notes: r.notes,
      created_at: r.created_at || new Date().toISOString(),
    }));

    onSubmit(completeResults);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-gray-900">Enter Lab Results</h3>
            <p className="text-sm text-gray-600 mt-1">
              {order.test_name} ({order.test_category}) - Order #{order.order_number}
            </p>
            <p className="text-sm text-gray-600">
              Patient: {visit.patient_details?.first_name} {visit.patient_details?.last_name} ({visit.patient_details?.mrn})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 rounded-lg space-y-4 relative"
              >
                {results.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeParameter(index)}
                    className="absolute top-2 right-2 p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Parameter Name */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Parameter Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={result.parameter_name || ''}
                      onChange={e => updateParameter(index, 'parameter_name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., WBC Count, Hemoglobin"
                      required
                    />
                  </div>

                  {/* Result Value */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Result Value <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={result.result_value || ''}
                      onChange={e => updateParameter(index, 'result_value', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 11.2"
                      required
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Unit <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={result.unit || ''}
                      onChange={e => updateParameter(index, 'unit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 10^9/L, g/dL"
                      required
                    />
                  </div>

                  {/* Reference Range */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Reference Range <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={result.reference_range || ''}
                      onChange={e => updateParameter(index, 'reference_range', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 4.0-11.0"
                      required
                    />
                  </div>

                  {/* Abnormal Flag */}
                  <div className="md:col-span-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={result.is_abnormal || false}
                        onChange={e => updateParameter(index, 'is_abnormal', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Mark as abnormal</span>
                      {result.is_abnormal && (
                        <AlertCircle className="text-red-600" size={16} />
                      )}
                    </label>
                  </div>

                  {/* Notes */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={result.notes || ''}
                      onChange={e => updateParameter(index, 'notes', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes or comments"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addParameter}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={20} />
              Add Another Parameter
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Results & Complete Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
