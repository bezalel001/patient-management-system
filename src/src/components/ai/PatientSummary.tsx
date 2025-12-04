import { X, Sparkles, User, AlertTriangle, Pill, Activity, FileText, TrendingUp } from 'lucide-react';
import { Patient, Visit } from '../../types';
import { formatDate } from '../../utils/formatters';

interface PatientSummaryProps {
  patient: Patient;
  visits: Visit[];
  onClose: () => void;
}

export function PatientSummary({ patient, visits, onClose }: PatientSummaryProps) {
  // Generate comprehensive patient summary
  const generateSummary = () => {
    const activeVisits = visits.filter(v => v.status === 'ACTIVE');
    const recentVisits = visits.slice(0, 5);
    
    // Get latest vitals from most recent visit
    const latestVisitWithVitals = visits.find(v => v.vital_signs && v.vital_signs.length > 0);
    const latestVitals = latestVisitWithVitals?.vital_signs?.[latestVisitWithVitals.vital_signs.length - 1];

    // Get active medications from current visit
    const activeMedications = activeVisits.flatMap(v => 
      (v.medication_orders || []).filter(m => m.status === 'ACTIVE')
    );

    // Get pending/in-progress labs
    const pendingLabs = activeVisits.flatMap(v => 
      (v.lab_orders || []).filter(l => l.status === 'PENDING' || l.status === 'IN_PROGRESS')
    );

    return {
      activeVisits,
      recentVisits,
      latestVitals,
      activeMedications,
      pendingLabs,
    };
  };

  const summary = generateSummary();

  // Determine alert level
  const getAlertLevel = () => {
    if (patient.allergies) return 'high';
    if (summary.activeVisits.length > 0) return 'medium';
    return 'low';
  };

  const alertLevel = getAlertLevel();

  /* 
  ============================================
  AI-POWERED SUMMARY GENERATION
  ============================================
  
  For production, you can enhance this with real AI-generated summaries:
  
  const generateAISummary = async () => {
    try {
      const response = await fetch('/api/ai/summarize-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${YOUR_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          patient_id: patient.id,
          include_visits: true,
          include_vitals: true,
          include_labs: true,
        }),
      });
      
      const data = await response.json();
      return data.summary;
    } catch (error) {
      console.error('AI summary error:', error);
      return null;
    }
  };
  
  Backend API endpoint example using OpenAI:
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      {
        role: "system",
        content: `You are a medical AI assistant. Generate a concise clinical summary for healthcare providers.
                  Focus on: current status, active problems, medications, recent vitals, pending investigations.
                  Format: Use clear sections and bullet points. Highlight critical information.`
      },
      {
        role: "user",
        content: `Summarize this patient:
                  Demographics: ${JSON.stringify(patientDemographics)}
                  Medical History: ${medicalHistory}
                  Active Visits: ${JSON.stringify(activeVisits)}
                  Recent Vitals: ${JSON.stringify(recentVitals)}
                  Current Medications: ${JSON.stringify(medications)}
                  Pending Labs: ${JSON.stringify(pendingLabs)}`
      }
    ],
    temperature: 0.3, // Lower temperature for more factual output
  });
  
  return completion.choices[0].message.content;
  */

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-gray-900">AI Patient Summary</h2>
              <p className="text-gray-600">
                {patient.first_name} {patient.last_name} • {patient.mrn}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert Banner */}
          {alertLevel !== 'low' && (
            <div className={`rounded-lg p-4 flex items-start gap-3 ${
              alertLevel === 'high' 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <AlertTriangle size={20} className={alertLevel === 'high' ? 'text-red-600' : 'text-yellow-600'} />
              <div className="flex-1">
                <h4 className={`mb-1 ${alertLevel === 'high' ? 'text-red-900' : 'text-yellow-900'}`}>
                  {alertLevel === 'high' ? 'Important Alerts' : 'Active Care Notifications'}
                </h4>
                <ul className={`text-sm space-y-1 ${alertLevel === 'high' ? 'text-red-700' : 'text-yellow-700'}`}>
                  {patient.allergies && (
                    <li>⚠️ Known Allergies: {patient.allergies}</li>
                  )}
                  {summary.activeVisits.length > 0 && (
                    <li>• Currently admitted - {summary.activeVisits.length} active visit(s)</li>
                  )}
                  {summary.pendingLabs.length > 0 && (
                    <li>• {summary.pendingLabs.length} pending lab result(s)</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Demographics */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <User size={18} className="text-gray-600" />
              <h3 className="text-gray-900">Patient Demographics</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Age</p>
                <p className="text-gray-900">{patient.age} years</p>
              </div>
              <div>
                <p className="text-gray-500">Gender</p>
                <p className="text-gray-900">
                  {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Blood Group</p>
                <p className="text-gray-900">{patient.blood_group || 'Not recorded'}</p>
              </div>
              <div>
                <p className="text-gray-500">Contact</p>
                <p className="text-gray-900">{patient.phone}</p>
              </div>
            </div>
          </div>

          {/* Clinical Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Status */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Activity size={18} className="text-blue-600" />
                <h3 className="text-gray-900">Current Status</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-500">Admission Status</p>
                  <p className="text-gray-900">
                    {summary.activeVisits.length > 0 
                      ? `Active - ${summary.activeVisits[0].visit_type} (${summary.activeVisits[0].visit_number})`
                      : 'Not currently admitted'}
                  </p>
                </div>
                {summary.activeVisits.length > 0 && (
                  <>
                    <div>
                      <p className="text-gray-500">Chief Complaint</p>
                      <p className="text-gray-900">{summary.activeVisits[0].chief_complaint}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Admitted On</p>
                      <p className="text-gray-900">
                        {formatDate(summary.activeVisits[0].admission_datetime)}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-gray-500">Total Visits</p>
                  <p className="text-gray-900">{visits.length} visits on record</p>
                </div>
              </div>
            </div>

            {/* Latest Vitals */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-green-600" />
                <h3 className="text-gray-900">Latest Vital Signs</h3>
              </div>
              {summary.latestVitals ? (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-500 mb-2">
                    Recorded: {new Date(summary.latestVitals.recorded_at).toLocaleDateString()}
                  </p>
                  {summary.latestVitals.temperature_celsius && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Temperature</span>
                      <span className="text-gray-900">{summary.latestVitals.temperature_celsius}°C</span>
                    </div>
                  )}
                  {summary.latestVitals.systolic_bp && summary.latestVitals.diastolic_bp && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Pressure</span>
                      <span className="text-gray-900">
                        {summary.latestVitals.systolic_bp}/{summary.latestVitals.diastolic_bp} mmHg
                      </span>
                    </div>
                  )}
                  {summary.latestVitals.heart_rate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Heart Rate</span>
                      <span className="text-gray-900">{summary.latestVitals.heart_rate} bpm</span>
                    </div>
                  )}
                  {summary.latestVitals.oxygen_saturation && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">SpO2</span>
                      <span className="text-gray-900">{summary.latestVitals.oxygen_saturation}%</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No vitals recorded</p>
              )}
            </div>
          </div>

          {/* Medical History */}
          {patient.medical_history && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-purple-600" />
                <h3 className="text-gray-900">Medical History</h3>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{patient.medical_history}</p>
            </div>
          )}

          {/* Active Medications */}
          {(summary.activeMedications.length > 0 || patient.current_medications) && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Pill size={18} className="text-orange-600" />
                <h3 className="text-gray-900">Current Medications</h3>
              </div>
              <div className="space-y-3">
                {summary.activeMedications.length > 0 ? (
                  <div className="space-y-2">
                    {summary.activeMedications.map(med => (
                      <div key={med.id} className="bg-orange-50 rounded p-3 text-sm">
                        <p className="text-gray-900">{med.medication_name}</p>
                        <p className="text-gray-600">
                          {med.dosage} • {med.route} • {med.frequency}
                        </p>
                        {med.instructions && (
                          <p className="text-gray-600 text-xs mt-1">{med.instructions}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : patient.current_medications ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{patient.current_medications}</p>
                ) : (
                  <p className="text-gray-500 text-sm">No active medications</p>
                )}
              </div>
            </div>
          )}

          {/* Recent Visit History */}
          {summary.recentVisits.length > 0 && (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-gray-600" />
                <h3 className="text-gray-900">Recent Visit History</h3>
              </div>
              <div className="space-y-2">
                {summary.recentVisits.map(visit => (
                  <div key={visit.id} className="border-l-2 border-blue-500 pl-3 py-2">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-900 text-sm">
                        {visit.visit_type} - {visit.visit_number}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        visit.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-700' 
                          : visit.status === 'DISCHARGED'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {visit.status}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{visit.chief_complaint}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatDate(visit.admission_datetime)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Summary Footer */}
          <div className="bg-blue-50 rounded-lg p-4 text-sm text-gray-700">
            <p className="mb-2">
              <strong>Summary Generated:</strong> {new Date().toLocaleString()}
            </p>
            <p className="text-gray-600">
              This summary provides a quick overview of {patient.first_name}'s current medical status. 
              For detailed information, review the complete patient record or use the AI chat assistant.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-end gap-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Print Summary
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
