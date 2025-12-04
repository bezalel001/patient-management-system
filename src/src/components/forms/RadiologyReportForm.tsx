import { useState } from 'react';
import { X, FileText, Calendar } from 'lucide-react';
import { RadiologyOrder, Visit, User } from '../../types';

interface RadiologyReportFormProps {
  order: RadiologyOrder;
  visit: Visit;
  currentUser: User;
  onClose: () => void;
  onSubmit: (data: { 
    status: 'SCHEDULED' | 'COMPLETED'; 
    report?: string; 
    scheduled_at?: string;
    completed_at?: string;
    radiologist?: string;
    radiologist_name?: string;
  }) => void;
}

export function RadiologyReportForm({ order, visit, currentUser, onClose, onSubmit }: RadiologyReportFormProps) {
  const [action, setAction] = useState<'schedule' | 'report'>('schedule');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [report, setReport] = useState(order.report || '');
  const [findings, setFindings] = useState('');
  const [impression, setImpression] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (action === 'schedule') {
      if (!scheduledDate || !scheduledTime) {
        alert('Please select both date and time');
        return;
      }

      const scheduledDateTime = `${scheduledDate}T${scheduledTime}:00Z`;
      onSubmit({
        status: 'SCHEDULED',
        scheduled_at: scheduledDateTime,
      });
    } else {
      if (!findings || !impression) {
        alert('Please fill in both findings and impression');
        return;
      }

      const fullReport = `FINDINGS:\n${findings}\n\nIMPRESSION:\n${impression}`;
      
      onSubmit({
        status: 'COMPLETED',
        report: fullReport,
        completed_at: new Date().toISOString(),
        radiologist: currentUser.id,
        radiologist_name: currentUser.full_name,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h3 className="text-gray-900 flex items-center gap-2">
              <FileText size={20} />
              Radiology Study Management
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {order.study_type} - {order.body_part} (Order #{order.order_number})
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Order Details */}
          <div className="bg-blue-50 p-4 rounded-lg space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-sm text-gray-600">Study Type:</span>
                <div className="text-gray-900">{order.study_type}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Body Part:</span>
                <div className="text-gray-900">{order.body_part}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Priority:</span>
                <div className="text-gray-900">{order.priority}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Status:</span>
                <div className="text-gray-900">{order.status}</div>
              </div>
            </div>
            <div className="pt-2 border-t border-blue-200">
              <span className="text-sm text-gray-600">Clinical Indication:</span>
              <div className="text-gray-900">{order.clinical_indication}</div>
            </div>
          </div>

          {/* Action Selection */}
          {order.status === 'PENDING' && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setAction('schedule')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  action === 'schedule'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <Calendar size={20} className="mx-auto mb-1" />
                Schedule Study
              </button>
              <button
                type="button"
                onClick={() => setAction('report')}
                className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${
                  action === 'report'
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                <FileText size={20} className="mx-auto mb-1" />
                Enter Report
              </button>
            </div>
          )}

          {/* Schedule Form */}
          {action === 'schedule' && (
            <div className="space-y-4">
              <h4 className="text-gray-900">Schedule Study</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={e => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">
                    Time <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={e => setScheduledTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                The patient will be notified of the scheduled appointment.
              </div>
            </div>
          )}

          {/* Report Form */}
          {action === 'report' && (
            <div className="space-y-4">
              <h4 className="text-gray-900">Radiology Report</h4>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Findings <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={findings}
                  onChange={e => setFindings(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Describe the radiological findings in detail..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Detailed description of what is observed in the study
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Impression <span className="text-red-600">*</span>
                </label>
                <textarea
                  value={impression}
                  onChange={e => setImpression(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder="Summary and clinical interpretation..."
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Clinical interpretation and diagnostic conclusion
                </p>
              </div>

              {/* Preview */}
              {(findings || impression) && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h5 className="text-sm text-gray-900 mb-2">Report Preview:</h5>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                    {findings && (
                      <>
                        <strong>FINDINGS:</strong>
                        {'\n'}
                        {findings}
                        {'\n\n'}
                      </>
                    )}
                    {impression && (
                      <>
                        <strong>IMPRESSION:</strong>
                        {'\n'}
                        {impression}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

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
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {action === 'schedule' ? 'Schedule Study' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
