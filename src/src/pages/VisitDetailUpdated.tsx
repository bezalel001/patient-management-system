import { ArrowLeft, User, Calendar, Building, FileText, Activity, TestTube, Package, DollarSign, MessageSquare, Printer, PlusCircle } from 'lucide-react';
import { Visit, Patient } from '../types';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { VitalsCard } from '../components/vitals/VitalsCard';
import { LabOrderCard } from '../components/orders/LabOrderCard';
import { MedicationCard } from '../components/orders/MedicationCard';
import { LabOrderForm } from '../components/forms/LabOrderForm';
import { MedicationOrderForm } from '../components/forms/MedicationOrderForm';
import { RadiologyOrderForm } from '../components/forms/RadiologyOrderForm';
import { DischargeSummaryForm } from '../components/forms/DischargeSummaryForm';
import { formatDateTime } from '../utils/formatters';
import { useState } from 'react';
import { PatientAIChat } from '../components/ai/PatientAIChat';

interface VisitDetailProps {
  visit: Visit;
  patient?: Patient; // Full patient data for AI features
  onBack: () => void;
  onRecordVitals?: () => void;
  onLabOrderCreated?: (order: any) => void;
  onMedicationOrdersCreated?: (medications: any[]) => void;
  onRadiologyOrderCreated?: (order: any) => void;
  onDischargeSummaryCreated?: (summary: any) => void;
}

export function VisitDetail({ visit, patient, onBack, onRecordVitals, onLabOrderCreated, onMedicationOrdersCreated, onRadiologyOrderCreated, onDischargeSummaryCreated }: VisitDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'labs' | 'medications' | 'radiology' | 'notes'>('overview');
  const [showAIChat, setShowAIChat] = useState(false);
  const [showLabOrderForm, setShowLabOrderForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showRadiologyForm, setShowRadiologyForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);

  // Mock current user - in production, get from auth context
  const currentUser = {
    id: 'user-1',
    role: 'DOCTOR' as const,
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: FileText },
    { id: 'vitals' as const, label: 'Vitals', icon: Activity, count: visit.vital_signs?.length },
    { id: 'labs' as const, label: 'Lab Orders', icon: TestTube, count: visit.lab_orders?.length },
    { id: 'medications' as const, label: 'Medications', icon: Package, count: visit.medication_orders?.length },
    { id: 'radiology' as const, label: 'Radiology', icon: FileText, count: visit.radiology_orders?.length },
    { id: 'notes' as const, label: 'Notes', icon: FileText },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-gray-900">{visit.visit_number}</h2>
              <Badge status={visit.status}>{visit.status}</Badge>
              <Badge status={visit.visit_type}>{visit.visit_type}</Badge>
            </div>
            {visit.patient_details && (
              <p className="text-gray-600">
                {visit.patient_details.first_name} {visit.patient_details.last_name} ({visit.patient_details.mrn})
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {/* AI Chat - only show if we have patient data */}
          {patient && (
            <button
              onClick={() => setShowAIChat(true)}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Ask AI
            </button>
          )}
          {visit.status === 'ACTIVE' && patient && (
            <button 
              onClick={() => setShowDischargeForm(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Discharge Patient
            </button>
          )}
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <DollarSign size={16} className="inline mr-1" />
            View Bill
          </button>
        </div>
      </div>

      {/* Forms */}
      {showLabOrderForm && (
        <LabOrderForm
          visitId={visit.id}
          visitNumber={visit.visit_number}
          onClose={() => setShowLabOrderForm(false)}
          onSubmit={(orderData) => {
            onLabOrderCreated?.(orderData);
            setShowLabOrderForm(false);
          }}
        />
      )}

      {showMedicationForm && (
        <MedicationOrderForm
          visitId={visit.id}
          visitNumber={visit.visit_number}
          onClose={() => setShowMedicationForm(false)}
          onSubmit={(medications) => {
            onMedicationOrdersCreated?.(medications);
            setShowMedicationForm(false);
          }}
        />
      )}

      {showRadiologyForm && (
        <RadiologyOrderForm
          visitId={visit.id}
          visitNumber={visit.visit_number}
          onClose={() => setShowRadiologyForm(false)}
          onSubmit={(orderData) => {
            onRadiologyOrderCreated?.(orderData);
            setShowRadiologyForm(false);
          }}
        />
      )}

      {showDischargeForm && patient && (
        <DischargeSummaryForm
          visit={visit}
          onClose={() => setShowDischargeForm(false)}
          onSubmit={(summaryData) => {
            onDischargeSummaryCreated?.(summaryData);
            setShowDischargeForm(false);
          }}
        />
      )}

      {/* AI Chat Modal */}
      {showAIChat && patient && (
        <PatientAIChat
          patient={patient}
          visits={[visit]}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
          onClose={() => setShowAIChat(false)}
        />
      )}

      {/* Patient & Visit Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Patient</p>
                {visit.patient_details && (
                  <>
                    <p className="text-gray-900">{visit.patient_details.first_name} {visit.patient_details.last_name}</p>
                    <p className="text-sm text-gray-600">{visit.patient_details.age} years • {visit.patient_details.gender}</p>
                  </>
                )}
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Admission</p>
                <p className="text-gray-900">{formatDateTime(visit.admission_datetime)}</p>
                <p className="text-sm text-gray-600">{visit.duration_days} days</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {visit.visit_type === 'IPD' && visit.bed_number && (
          <Card>
            <CardBody>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Building size={24} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Bed Assignment</p>
                  <p className="text-gray-900">{visit.ward}</p>
                  <p className="text-sm text-gray-600">Bed {visit.bed_number}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Chief Complaint</h3>
              </CardHeader>
              <CardBody>
                <p className="text-gray-700">{visit.chief_complaint}</p>
              </CardBody>
            </Card>

            {visit.history_of_present_illness && (
              <Card>
                <CardHeader>
                  <h3 className="text-gray-900">History of Present Illness</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-wrap">{visit.history_of_present_illness}</p>
                </CardBody>
              </Card>
            )}

            {visit.physical_examination && (
              <Card>
                <CardHeader>
                  <h3 className="text-gray-900">Physical Examination</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-wrap">{visit.physical_examination}</p>
                </CardBody>
              </Card>
            )}

            {visit.diagnosis && (
              <Card>
                <CardHeader>
                  <h3 className="text-gray-900">Diagnosis</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-wrap">{visit.diagnosis}</p>
                </CardBody>
              </Card>
            )}

            {visit.treatment_plan && (
              <Card>
                <CardHeader>
                  <h3 className="text-gray-900">Treatment Plan</h3>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-700 whitespace-pre-wrap">{visit.treatment_plan}</p>
                </CardBody>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Quick Actions</h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button 
                    onClick={() => setShowLabOrderForm(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors flex flex-col items-center gap-2"
                  >
                    <TestTube size={24} className="text-blue-600" />
                    <span className="text-sm text-gray-700">Order Lab Test</span>
                  </button>
                  <button 
                    onClick={() => setShowMedicationForm(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors flex flex-col items-center gap-2"
                  >
                    <Package size={24} className="text-green-600" />
                    <span className="text-sm text-gray-700">Prescribe Meds</span>
                  </button>
                  <button 
                    onClick={() => setShowRadiologyForm(true)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors flex flex-col items-center gap-2"
                  >
                    <FileText size={24} className="text-purple-600" />
                    <span className="text-sm text-gray-700">Order Imaging</span>
                  </button>
                  {onRecordVitals && (
                    <button 
                      onClick={onRecordVitals}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors flex flex-col items-center gap-2"
                    >
                      <Activity size={24} className="text-red-600" />
                      <span className="text-sm text-gray-700">Record Vitals</span>
                    </button>
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Assigned Staff */}
            {(visit.assigned_doctors_details || visit.assigned_nurses_details) && (
              <Card>
                <CardHeader>
                  <h3 className="text-gray-900">Assigned Staff</h3>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {visit.assigned_doctors_details && visit.assigned_doctors_details.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Doctors</p>
                        <div className="space-y-2">
                          {visit.assigned_doctors_details.map(doctor => (
                            <div key={doctor.id} className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm">
                                {doctor.first_name[0]}{doctor.last_name[0]}
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">Dr. {doctor.full_name}</p>
                                {doctor.specialization && (
                                  <p className="text-xs text-gray-600">{doctor.specialization}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visit.assigned_nurses_details && visit.assigned_nurses_details.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Nurses</p>
                        <div className="space-y-2">
                          {visit.assigned_nurses_details.map(nurse => (
                            <div key={nurse.id} className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-sm">
                                {nurse.first_name[0]}{nurse.last_name[0]}
                              </div>
                              <p className="text-sm text-gray-900">{nurse.full_name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'vitals' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900">Vital Signs History</h3>
              {onRecordVitals && (
                <button 
                  onClick={onRecordVitals}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Record New Vitals
                </button>
              )}
            </div>
            {visit.vital_signs && visit.vital_signs.length > 0 ? (
              visit.vital_signs.map(vitals => (
                <VitalsCard key={vitals.id} vitals={vitals} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12 text-gray-500">
                  <Activity size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No vital signs recorded yet</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900">Laboratory Orders</h3>
              <button 
                onClick={() => setShowLabOrderForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Lab Order
              </button>
            </div>
            {visit.lab_orders && visit.lab_orders.length > 0 ? (
              visit.lab_orders.map(order => (
                <LabOrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12 text-gray-500">
                  <TestTube size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No lab orders placed yet</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'medications' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900">Medications</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowMedicationForm(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Prescribe Medication
                </button>
                {visit.medication_orders && visit.medication_orders.length > 0 && (
                  <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Printer size={16} />
                    Print Prescription
                  </button>
                )}
              </div>
            </div>
            {visit.medication_orders && visit.medication_orders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visit.medication_orders.map(medication => (
                  <MedicationCard key={medication.id} medication={medication} />
                ))}
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No medications prescribed yet</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'radiology' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-gray-900">Radiology Orders</h3>
              <button 
                onClick={() => setShowRadiologyForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Order Radiology Study
              </button>
            </div>
            {visit.radiology_orders && visit.radiology_orders.length > 0 ? (
              visit.radiology_orders.map(order => (
                <Card key={order.id}>
                  <CardBody>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-gray-900">{order.study_type}</h4>
                          <Badge status={order.status}>{order.status}</Badge>
                          {order.priority !== 'ROUTINE' && (
                            <Badge status={order.priority}>{order.priority}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">Body Part: {order.body_part}</p>
                        <p className="text-sm text-gray-600">Clinical Indication: {order.clinical_indication}</p>
                        <p className="text-sm text-gray-600">Ordered by: {order.ordered_by_name}</p>
                        <p className="text-sm text-gray-600">Order Date: {formatDateTime(order.ordered_at)}</p>
                        {order.report && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-gray-900 mb-1">Report:</p>
                            <p className="text-sm text-gray-700">{order.report}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))
            ) : (
              <Card>
                <CardBody className="text-center py-12 text-gray-500">
                  <FileText size={48} className="mx-auto mb-3 text-gray-300" />
                  <p>No radiology orders placed yet</p>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Clinical Notes</h3>
            </CardHeader>
            <CardBody>
              <textarea
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter clinical notes here..."
              />
              <div className="mt-4 flex justify-end">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Save Notes
                </button>
              </div>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
