import { Visit, Patient, LabOrder } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface LabResultsPrintProps {
  visit: Visit;
  patient: Patient;
  labOrder: LabOrder;
}

export function LabResultsPrint({ visit, patient, labOrder }: LabResultsPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="print:hidden mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Lab Results
        </button>
      </div>

      <div className="lab-results-print bg-white p-8 max-w-4xl mx-auto border border-gray-300 rounded-lg print:border-0 print:rounded-none">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-gray-900 mb-1">MediFlow Hospital</h1>
            <h2 className="text-gray-700">Clinical Laboratory</h2>
            <p className="text-gray-600">123 Healthcare Avenue, Medical District</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4567 | Email: lab@mediflow.com</p>
          </div>
        </div>

        {/* Lab Order Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Order Number:</p>
              <p className="text-gray-900">{labOrder.order_number}</p>
            </div>
            <div>
              <p className="text-gray-600">Visit Number:</p>
              <p className="text-gray-900">{visit.visit_number}</p>
            </div>
            <div>
              <p className="text-gray-600">Sample Collected:</p>
              <p className="text-gray-900">{formatDateTime(labOrder.ordered_at)}</p>
            </div>
            <div>
              <p className="text-gray-600">Report Date:</p>
              <p className="text-gray-900">{labOrder.completed_at ? formatDateTime(labOrder.completed_at) : 'Pending'}</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Patient Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Name:</p>
              <p className="text-gray-900">{patient.first_name} {patient.last_name}</p>
            </div>
            <div>
              <p className="text-gray-600">MRN:</p>
              <p className="text-gray-900">{patient.mrn}</p>
            </div>
            <div>
              <p className="text-gray-600">Age/Gender:</p>
              <p className="text-gray-900">{patient.age} years / {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</p>
            </div>
            <div>
              <p className="text-gray-600">Contact:</p>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Test Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Test Name:</p>
              <p className="text-gray-900">{labOrder.test_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Category:</p>
              <p className="text-gray-900">{labOrder.test_category}</p>
            </div>
            <div>
              <p className="text-gray-600">Ordered By:</p>
              <p className="text-gray-900">{labOrder.ordered_by_name}</p>
            </div>
            <div>
              <p className="text-gray-600">Lab Technician:</p>
              <p className="text-gray-900">{labOrder.technician_name || 'N/A'}</p>
            </div>
          </div>
          {labOrder.clinical_notes && (
            <div className="mt-3">
              <p className="text-gray-600">Clinical Notes:</p>
              <p className="text-gray-700">{labOrder.clinical_notes}</p>
            </div>
          )}
        </div>

        {/* Results Table */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Test Results</h3>
          
          {labOrder.results && labOrder.results.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Result</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Unit</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-900">Reference Range</th>
                  <th className="border border-gray-300 px-4 py-2 text-center text-gray-900">Flag</th>
                </tr>
              </thead>
              <tbody>
                {labOrder.results.map((result) => (
                  <tr key={result.id} className={result.is_abnormal ? 'bg-red-50' : ''}>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">
                      {result.parameter_name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-900">
                      {result.result_value}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {result.unit}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">
                      {result.reference_range}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-center">
                      {result.is_abnormal && (
                        <span className="inline-block bg-red-600 text-white px-2 py-1 rounded">
                          Abnormal
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 italic">No results available yet</p>
          )}
        </div>

        {/* Notes */}
        {labOrder.results?.some(r => r.notes) && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Additional Notes</h3>
            {labOrder.results
              .filter(r => r.notes)
              .map((result) => (
                <div key={result.id} className="mb-2">
                  <p className="text-gray-900">{result.parameter_name}:</p>
                  <p className="text-gray-700 ml-4">{result.notes}</p>
                </div>
              ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-600">Report generated: {formatDateTime(new Date().toISOString())}</p>
              <p className="text-gray-600 mt-2 italic">*This is a computer-generated report</p>
            </div>
            {labOrder.technician_name && (
              <div className="text-right">
                <div className="border-t border-gray-800 pt-2 mt-8" style={{ minWidth: '200px' }}>
                  <p className="text-gray-900">{labOrder.technician_name}</p>
                  <p className="text-gray-600">Lab Technician</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-gray-700">
            <strong>Note:</strong> These results should be correlated with clinical findings. 
            Please consult your physician for interpretation and treatment decisions.
          </p>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .lab-results-print {
            max-width: 100%;
            margin: 0;
            padding: 20mm;
            box-shadow: none;
          }
          @page {
            margin: 0;
            size: A4;
          }
        }
      `}</style>
    </div>
  );
}
