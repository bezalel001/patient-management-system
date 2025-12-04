import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { MedicationOrder, Visit, User } from '../../types';

interface MedicationDispenseFormProps {
  order: MedicationOrder;
  visit: Visit;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: { dispensed_by: string; dispensed_by_name: string; dispensed_at: string; notes?: string }) => void;
}

export function MedicationDispenseForm({ order, visit, currentUser, onClose, onSubmit }: MedicationDispenseFormProps) {
  const [notes, setNotes] = useState('');
  const [confirmedQuantity, setConfirmedQuantity] = useState(false);
  const [confirmedInstructions, setConfirmedInstructions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!confirmedQuantity || !confirmedInstructions) {
      alert('Please confirm all checkboxes before dispensing');
      return;
    }

    onSubmit({
      dispensed_by: currentUser.id,
      dispensed_by_name: currentUser.full_name,
      dispensed_at: new Date().toISOString(),
      notes: notes || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-gray-900 flex items-center gap-2">
              <Package size={20} />
              Dispense Medication
            </h3>
            <p className="text-sm text-gray-600 mt-1">Order #{order.order_number}</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Medication Details */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-600">Medication:</span>
                <div className="text-gray-900">{order.medication_name}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Dosage:</span>
                <div className="text-gray-900">{order.dosage}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Route:</span>
                <div className="text-gray-900">{order.route}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Frequency:</span>
                <div className="text-gray-900">{order.frequency}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Duration:</span>
                <div className="text-gray-900">{order.duration_days} days</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Prescribed by:</span>
                <div className="text-gray-900">{order.prescribed_by_name}</div>
              </div>
            </div>
            {order.instructions && (
              <div className="pt-2 border-t border-blue-200">
                <span className="text-sm text-gray-600">Instructions:</span>
                <div className="text-gray-900">{order.instructions}</div>
              </div>
            )}
          </div>

          {/* Dispense Confirmation */}
          <div className="space-y-3">
            <h4 className="text-gray-900">Dispensing Checklist</h4>
            
            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedQuantity}
                onChange={e => setConfirmedQuantity(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900">Confirmed medication quantity</div>
                <div className="text-sm text-gray-600">
                  Verified correct quantity for {order.duration_days} days supply
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedInstructions}
                onChange={e => setConfirmedInstructions(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <div>
                <div className="text-gray-900">Patient instructions provided</div>
                <div className="text-sm text-gray-600">
                  Explained dosage, frequency, and any special instructions to patient
                </div>
              </div>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-700 mb-1">
              Dispensing Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Any additional notes about dispensing..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmedQuantity || !confirmedInstructions}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Dispensing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
