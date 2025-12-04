import { useState } from 'react';
import { ArrowLeft, User, Phone, Mail, Home, Droplet, AlertCircle, Calendar, FileText, MessageSquare, Sparkles, Plus } from 'lucide-react';
import { Patient, Visit } from '../types';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { VisitCard } from '../components/visits/VisitCard';
import { AttendingStaff } from '../components/patients/AttendingStaff';
import { formatDate } from '../utils/formatters';
import { PatientAIChat } from '../components/ai/PatientAIChat';
import { PatientSummary } from '../components/ai/PatientSummary';

interface PatientDetailProps {
  patient: Patient;
  visits: Visit[];
  onBack: () => void;
  onCreateVisit?: (patient: Patient) => void;
}

export function PatientDetail({ patient, visits, onBack, onCreateVisit }: PatientDetailProps) {
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  // Mock current user - in production, get from auth context
  const currentUser = {
    id: 'user-1',
    role: 'DOCTOR' as const,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-gray-900">Patient Details</h2>
          <p className="text-gray-600">Complete medical record and history</p>
        </div>
        
        {/* AI Features */}
        <button
          onClick={() => setShowSummary(true)}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2"
        >
          <Sparkles size={18} />
          AI Summary
        </button>
        <button
          onClick={() => setShowAIChat(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <MessageSquare size={18} />
          Ask AI
        </button>
        {onCreateVisit && (
          <button 
            onClick={() => onCreateVisit(patient)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            Create Visit
          </button>
        )}
      </div>

      {/* AI Chat Modal */}
      {showAIChat && (
        <PatientAIChat
          patient={patient}
          visits={visits}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
          onClose={() => setShowAIChat(false)}
        />
      )}

      {/* AI Summary Modal */}
      {showSummary && (
        <PatientSummary
          patient={patient}
          visits={visits}
          onClose={() => setShowSummary(false)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Patient Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardBody>
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                  <User size={40} />
                </div>
                <h3 className="text-gray-900">{patient.first_name} {patient.last_name}</h3>
                <p className="text-gray-600">{patient.age} years old • {patient.gender === 'M' ? 'Male' : patient.gender === 'F' ? 'Female' : 'Other'}</p>
                <p className="text-sm text-gray-500 mt-1">MRN: {patient.mrn}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm">
                  <Phone size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="text-gray-900">{patient.phone}</p>
                  </div>
                </div>

                {patient.email && (
                  <div className="flex items-start gap-3 text-sm">
                    <Mail size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="text-gray-900">{patient.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm">
                  <Home size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="text-gray-900">{patient.address}</p>
                    {patient.city && patient.state && (
                      <p className="text-gray-900">{patient.city}, {patient.state}</p>
                    )}
                  </div>
                </div>

                {patient.blood_group && (
                  <div className="flex items-start gap-3 text-sm">
                    <Droplet size={16} className="text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-500">Blood Group</p>
                      <p className="text-gray-900">{patient.blood_group}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 text-sm">
                  <Calendar size={16} className="text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="text-gray-900">{formatDate(patient.date_of_birth)}</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Emergency Contacts */}
          {patient.emergency_contacts && patient.emergency_contacts.length > 0 && (
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Emergency Contacts</h3>
              </CardHeader>
              <CardBody className="space-y-4">
                {patient.emergency_contacts.map(contact => (
                  <div key={contact.id} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">{contact.relationship}</p>
                    <p className="text-sm text-gray-600">{contact.phone}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}

          {/* Insurance */}
          {patient.insurance_provider && (
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Insurance Information</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-900 mb-1">{patient.insurance_provider}</p>
                <p className="text-sm text-gray-600">Policy: {patient.insurance_number}</p>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Medical Info & Visits */}
        <div className="lg:col-span-2 space-y-6">
          {/* Allergies */}
          {patient.allergies && (
            <Card>
              <CardBody>
                <div className="flex items-start gap-3">
                  <AlertCircle size={20} className="text-red-600 mt-0.5" />
                  <div>
                    <h3 className="text-red-600 mb-1">Allergies</h3>
                    <p className="text-gray-900">{patient.allergies}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Medical History */}
          {patient.medical_history && (
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Medical History</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 whitespace-pre-wrap">{patient.medical_history}</p>
              </CardBody>
            </Card>
          )}

          {/* Current Medications */}
          {patient.current_medications && (
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Current Medications</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700 whitespace-pre-wrap">{patient.current_medications}</p>
              </CardBody>
            </Card>
          )}

          {/* Attending Staff */}
          {visits.length > 0 && (
            <AttendingStaff visits={visits} />
          )}

          {/* Visits */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={20} className="text-gray-600" />
                  <h3 className="text-gray-900">Visit History</h3>
                </div>
                <span className="text-sm text-gray-500">{visits.length} visits</span>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              {visits.length > 0 ? (
                visits.map(visit => (
                  <VisitCard key={visit.id} visit={visit} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No visits recorded yet</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
