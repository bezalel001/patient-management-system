import { Visit, Patient, User } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface PrescriptionPrintProps {
  visit: Visit;
  patient: Patient;
  prescribedBy: User;
}

export function PrescriptionPrint({ visit, patient, prescribedBy }: PrescriptionPrintProps) {
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
          Print Prescription
        </button>
      </div>

      <div className="prescription-print bg-white p-8 max-w-4xl mx-auto border border-gray-300 rounded-lg print:border-0 print:rounded-none">
        {/* Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-6">
          <div className="text-center">
            <h1 className="text-gray-900 mb-1">MediFlow Hospital</h1>
            <p className="text-gray-600">123 Healthcare Avenue, Medical District</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4567 | Email: info@mediflow.com</p>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="mb-6">
          <h2 className="text-gray-900 mb-2">{prescribedBy.full_name}</h2>
          <p className="text-gray-700">{prescribedBy.specialization}</p>
          <p className="text-gray-700">Reg. No: {prescribedBy.license_number}</p>
        </div>

        {/* Patient Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Patient Name:</p>
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
              <p className="text-gray-600">Date:</p>
              <p className="text-gray-900">{formatDate(visit.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Diagnosis */}
        {visit.diagnosis && (
          <div className="mb-6">
            <h3 className="text-gray-900 mb-2">Diagnosis</h3>
            <p className="text-gray-700">{visit.diagnosis}</p>
          </div>
        )}

        {/* Rx Symbol */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gray-900" style={{ fontSize: '2rem' }}>℞</span>
          <h3 className="text-gray-900">Prescription</h3>
        </div>

        {/* Medications */}
        <div className="space-y-4 mb-8">
          {visit.medication_orders && visit.medication_orders.length > 0 ? (
            visit.medication_orders.map((med, index) => (
              <div key={med.id} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="text-gray-900">{index + 1}. {med.medication_name}</h4>
                    <p className="text-gray-700">
                      {med.dosage} - {med.route} - {med.frequency}
                    </p>
                    <p className="text-gray-700">Duration: {med.duration_days} days</p>
                    {med.instructions && (
                      <p className="text-gray-600 italic mt-1">{med.instructions}</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No medications prescribed</p>
          )}
        </div>

        {/* Follow-up */}
        {visit.treatment_plan && (
          <div className="mb-8">
            <h3 className="text-gray-900 mb-2">Instructions</h3>
            <p className="text-gray-700">{visit.treatment_plan}</p>
          </div>
        )}

        {/* Signature */}
        <div className="mt-12 pt-6 border-t border-gray-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-600">Visit Number: {visit.visit_number}</p>
              <p className="text-gray-600">Printed: {formatDateTime(new Date().toISOString())}</p>
            </div>
            <div className="text-right">
              <div className="border-t border-gray-800 pt-2 mt-8" style={{ minWidth: '200px' }}>
                <p className="text-gray-900">{prescribedBy.full_name}</p>
                <p className="text-gray-600">{prescribedBy.specialization}</p>
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
          .prescription-print {
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
