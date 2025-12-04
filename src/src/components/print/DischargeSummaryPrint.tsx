import { Visit, Patient, DischargeSummary } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface DischargeSummaryPrintProps {
  visit: Visit;
  patient: Patient;
  dischargeSummary: DischargeSummary;
}

export function DischargeSummaryPrint({ visit, patient, dischargeSummary }: DischargeSummaryPrintProps) {
  const handlePrint = () => {
    window.print();
  };

  const calculateDuration = () => {
    const admission = new Date(dischargeSummary.admission_date);
    const discharge = new Date(dischargeSummary.discharge_date);
    const diffTime = Math.abs(discharge.getTime() - admission.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      <div className="print:hidden mb-4">
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Print Discharge Summary
        </button>
      </div>

      <div className="discharge-summary-print bg-white p-8 max-w-4xl mx-auto border border-gray-300 rounded-lg print:border-0 print:rounded-none">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-gray-900 mb-1">MediFlow Hospital</h1>
            <p className="text-gray-600">123 Healthcare Avenue, Medical District</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4567 | Email: info@mediflow.com</p>
          </div>
          <div className="text-center mt-4">
            <h2 className="text-gray-900">Discharge Summary</h2>
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
              <p className="text-gray-600">Date of Birth:</p>
              <p className="text-gray-900">{formatDate(patient.date_of_birth)}</p>
            </div>
            <div>
              <p className="text-gray-600">Contact:</p>
              <p className="text-gray-900">{patient.phone}</p>
            </div>
            <div>
              <p className="text-gray-600">Blood Group:</p>
              <p className="text-gray-900">{patient.blood_group || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Admission Details */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Admission Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Visit Number:</p>
              <p className="text-gray-900">{visit.visit_number}</p>
            </div>
            <div>
              <p className="text-gray-600">Visit Type:</p>
              <p className="text-gray-900">{visit.visit_type}</p>
            </div>
            <div>
              <p className="text-gray-600">Admission Date:</p>
              <p className="text-gray-900">{formatDateTime(dischargeSummary.admission_date)}</p>
            </div>
            <div>
              <p className="text-gray-600">Discharge Date:</p>
              <p className="text-gray-900">{formatDateTime(dischargeSummary.discharge_date)}</p>
            </div>
            <div>
              <p className="text-gray-600">Length of Stay:</p>
              <p className="text-gray-900">{calculateDuration()} days</p>
            </div>
            {visit.ward && (
              <div>
                <p className="text-gray-600">Ward/Bed:</p>
                <p className="text-gray-900">{visit.ward} {visit.bed_number ? `- Bed ${visit.bed_number}` : ''}</p>
              </div>
            )}
          </div>
        </div>

        {/* Final Diagnosis */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Final Diagnosis</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.final_diagnosis}</p>
        </div>

        {/* Hospital Course */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Hospital Course</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.hospital_course}</p>
        </div>

        {/* Procedures Performed */}
        {dischargeSummary.procedures_performed && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Procedures Performed</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.procedures_performed}</p>
          </div>
        )}

        {/* Discharge Medications */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Discharge Medications</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.discharge_medications}</p>
        </div>

        {/* Follow-up Instructions */}
        <div className="mb-6">
          <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Follow-up Instructions</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.follow_up_instructions}</p>
        </div>

        {/* Diet Restrictions */}
        {dischargeSummary.diet_restrictions && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Diet Restrictions</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.diet_restrictions}</p>
          </div>
        )}

        {/* Activity Restrictions */}
        {dischargeSummary.activity_restrictions && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-3 pb-2 border-b border-gray-300">Activity Restrictions</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{dischargeSummary.activity_restrictions}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-600">Prepared by: {dischargeSummary.prepared_by_name}</p>
              <p className="text-gray-600">Date: {formatDateTime(dischargeSummary.created_at)}</p>
            </div>
            <div className="text-right">
              <div className="border-t border-gray-800 pt-2 mt-8" style={{ minWidth: '200px' }}>
                <p className="text-gray-900">Authorized Signature</p>
                <p className="text-gray-600">{dischargeSummary.prepared_by_name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .discharge-summary-print {
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
