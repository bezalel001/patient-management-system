import { Users, Clipboard, Activity, DollarSign, TrendingUp, Calendar, ClipboardList } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { VisitCard } from '../components/visits/VisitCard';
import { PatientCard } from '../components/patients/PatientCard';
import { AIFeatureBanner } from '../components/ai/AIFeatureBanner';
import { Visit, Patient } from '../types';

interface DashboardProps {
  userRole: string;
  patients?: Patient[];
  visits?: Visit[];
  onPatientClick?: (patient: Patient) => void;
  onVisitClick?: (visit: Visit) => void;
  onRegisterPatient?: () => void;
  onCreateVisit?: () => void;
  onRecordVitals?: () => void;
}

export function Dashboard({ userRole, patients = [], visits = [], onPatientClick, onVisitClick, onRegisterPatient, onCreateVisit, onRecordVitals }: DashboardProps) {
  // Calculate real statistics
  const activeVisits = visits.filter(v => v.status === 'ACTIVE').length;
  const todayVisits = visits.filter(v => {
    const visitDate = new Date(v.admission_datetime);
    const today = new Date();
    return visitDate.toDateString() === today.toDateString();
  });
  
  const pendingLabOrders = visits.reduce((count, visit) => {
    const pending = visit.lab_orders?.filter(order => 
      order.status === 'PENDING' || order.status === 'IN_PROGRESS'
    ).length || 0;
    return count + pending;
  }, 0);
  
  const stats = [
    {
      label: 'Total Patients',
      value: patients.length.toString(),
      change: `${patients.length} registered`,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Active Visits',
      value: activeVisits.toString(),
      change: `${todayVisits.length} today`,
      icon: Clipboard,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Pending Lab Orders',
      value: pendingLabOrders.toString(),
      change: 'Needs attention',
      icon: Activity,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Total Visits',
      value: visits.length.toString(),
      change: `${visits.filter(v => v.visit_type === 'IPD').length} IPD`,
      icon: ClipboardList,
      color: 'bg-yellow-100 text-yellow-600',
    },
  ];

  // Get the most recent patients (last 3)
  const recentPatients = patients.slice(0, 3);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                    <h3 className="text-gray-900 mb-1">{stat.value}</h3>
                    <div className="flex items-center gap-1">
                      <TrendingUp size={14} className="text-green-600" />
                      <span className="text-sm text-green-600">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon size={24} />
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {/* AI Features Banner */}
      <AIFeatureBanner />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Today's Visits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar size={20} className="text-gray-600" />
                <h3 className="text-gray-900">Today's Visits</h3>
              </div>
              <span className="text-sm text-gray-600">{todayVisits.length} visits</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {todayVisits.length > 0 ? (
              todayVisits.map(visit => (
                <VisitCard 
                  key={visit.id} 
                  visit={visit}
                  onClick={onVisitClick ? () => onVisitClick(visit) : undefined}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No visits scheduled for today
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-gray-600" />
                <h3 className="text-gray-900">Recent Patients</h3>
              </div>
              <span className="text-sm text-gray-600">{patients.length} total</span>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            {recentPatients.length > 0 ? (
              recentPatients.map(patient => (
                <PatientCard 
                  key={patient.id} 
                  patient={patient}
                  onClick={onPatientClick ? () => onPatientClick(patient) : undefined}
                />
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No patients registered yet
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      {(userRole === 'DOCTOR' || userRole === 'RECEPTIONIST' || userRole === 'ADMIN') && (
        <Card>
          <CardHeader>
            <h3 className="text-gray-900">Quick Actions</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <button 
                onClick={onRegisterPatient}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Users size={20} className="text-blue-600 mb-2" />
                <h4 className="text-gray-900 mb-1">Register Patient</h4>
                <p className="text-sm text-gray-600">Add new patient to the system</p>
              </button>
              <button 
                onClick={onCreateVisit}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <ClipboardList size={20} className="text-green-600 mb-2" />
                <h4 className="text-gray-900 mb-1">Create Visit</h4>
                <p className="text-sm text-gray-600">Start new patient visit</p>
              </button>
              <button 
                onClick={onRecordVitals}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left transition-colors"
              >
                <Activity size={20} className="text-purple-600 mb-2" />
                <h4 className="text-gray-900 mb-1">Record Vitals</h4>
                <p className="text-sm text-gray-600">Add patient vital signs</p>
              </button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}