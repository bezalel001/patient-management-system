import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { 
  TrendingUp, 
  Users, 
  Activity, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Visit, Patient, User } from '../types';
import { formatDate, formatCurrency } from '../utils/formatters';
import { BarChart, Bar, LineChart as RechartsLine, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ReportsProps {
  visits: Visit[];
  patients: Patient[];
  currentUser: User;
}

type ReportPeriod = 'week' | 'month' | 'quarter' | 'year';

export function Reports({ visits, patients, currentUser }: ReportsProps) {
  const [period, setPeriod] = useState<ReportPeriod>('month');
  const [reportType, setReportType] = useState<'overview' | 'clinical' | 'financial'>('overview');

  // Calculate statistics
  const activeVisits = visits.filter(v => v.status === 'ACTIVE');
  const completedVisits = visits.filter(v => v.status === 'DISCHARGED');
  const opdVisits = visits.filter(v => v.visit_type === 'OPD');
  const ipdVisits = visits.filter(v => v.visit_type === 'IPD');

  // Calculate average length of stay for IPD
  const avgLengthOfStay = ipdVisits.length > 0
    ? (ipdVisits.reduce((sum, v) => sum + (v.duration_days || 0), 0) / ipdVisits.length).toFixed(1)
    : '0';

  // Calculate bed occupancy (mock calculation - in real system, would be based on actual bed capacity)
  const totalBeds = 50;
  const occupiedBeds = activeVisits.filter(v => v.visit_type === 'IPD').length;
  const bedOccupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(1);

  // Lab orders statistics
  const allLabOrders = visits.flatMap(v => v.lab_orders || []);
  const completedLabOrders = allLabOrders.filter(o => o.status === 'COMPLETED');
  const pendingLabOrders = allLabOrders.filter(o => o.status === 'PENDING');

  // Medication statistics
  const allMedications = visits.flatMap(v => v.medication_orders || []);
  const activeMedications = allMedications.filter(m => m.status === 'ACTIVE');

  // Visit trends by day (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const visitTrendData = last7Days.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    const dayVisits = visits.filter(v => {
      const visitDate = new Date(v.admission_datetime);
      return visitDate.toISOString().split('T')[0] === dateStr;
    });
    
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      OPD: dayVisits.filter(v => v.visit_type === 'OPD').length,
      IPD: dayVisits.filter(v => v.visit_type === 'IPD').length,
      total: dayVisits.length,
    };
  });

  // Visit type distribution
  const visitTypeData = [
    { name: 'OPD', value: opdVisits.length, color: '#3b82f6' },
    { name: 'IPD', value: ipdVisits.length, color: '#8b5cf6' },
  ];

  // Visit status distribution
  const visitStatusData = [
    { name: 'Active', value: activeVisits.length, color: '#10b981' },
    { name: 'Discharged', value: completedVisits.length, color: '#6b7280' },
  ];

  // Top diagnoses (mock data - in real system, would aggregate from visits)
  const diagnosisData = [
    { diagnosis: 'Upper Respiratory Infection', count: 12 },
    { diagnosis: 'Hypertension', count: 8 },
    { diagnosis: 'Diabetes Management', count: 7 },
    { diagnosis: 'Gastroenteritis', count: 5 },
    { diagnosis: 'Other', count: visits.length - 32 },
  ];

  const handleExportReport = () => {
    // In a real application, this would generate a PDF or Excel file
    alert('Report export functionality would be implemented here');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">View comprehensive hospital statistics and insights</p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Download size={16} />
          Export Report
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          <Filter size={16} className="text-gray-400 self-center" />
          {(['week', 'month', 'quarter', 'year'] as ReportPeriod[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                period === p
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p === 'week' && 'Last Week'}
              {p === 'month' && 'Last Month'}
              {p === 'quarter' && 'Last Quarter'}
              {p === 'year' && 'Last Year'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 border-l border-gray-300 pl-3">
          {(['overview', 'clinical', 'financial'] as const).map(type => (
            <button
              key={type}
              onClick={() => setReportType(type)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                reportType === type
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {type === 'overview' && 'Overview'}
              {type === 'clinical' && 'Clinical'}
              {type === 'financial' && 'Financial'}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl text-gray-900 mt-1">{patients.length}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={14} />
                  +12% vs last {period}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Visits</p>
                <p className="text-2xl text-gray-900 mt-1">{activeVisits.length}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {opdVisits.length} OPD • {ipdVisits.length} IPD
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Activity className="text-green-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bed Occupancy</p>
                <p className="text-2xl text-gray-900 mt-1">{bedOccupancyRate}%</p>
                <p className="text-sm text-gray-500 mt-1">
                  {occupiedBeds} / {totalBeds} beds
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <BarChart3 className="text-purple-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Length of Stay</p>
                <p className="text-2xl text-gray-900 mt-1">{avgLengthOfStay} days</p>
                <p className="text-sm text-gray-500 mt-1">IPD patients</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="text-orange-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Charts */}
      {reportType === 'overview' && (
        <>
          {/* Visit Trends */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Visit Trends (Last 7 Days)</h3>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={visitTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="OPD" fill="#3b82f6" />
                  <Bar dataKey="IPD" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Visit Type & Status Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Visit Type Distribution</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={visitTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {visitTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-gray-900">Visit Status</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPie>
                    <Pie
                      data={visitStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => 
                        `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {visitStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </>
      )}

      {reportType === 'clinical' && (
        <>
          {/* Clinical Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardBody>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Lab Orders</p>
                  <p className="text-3xl text-gray-900 mt-2">{allLabOrders.length}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="text-green-600">{completedLabOrders.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Pending:</span>
                      <span className="text-yellow-600">{pendingLabOrders.length}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Medications Prescribed</p>
                  <p className="text-3xl text-gray-900 mt-2">{allMedications.length}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active:</span>
                      <span className="text-blue-600">{activeMedications.length}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Visits</p>
                  <p className="text-3xl text-gray-900 mt-2">{visits.length}</p>
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Active:</span>
                      <span className="text-green-600">{activeVisits.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discharged:</span>
                      <span className="text-gray-600">{completedVisits.length}</span>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Top Diagnoses */}
          <Card>
            <CardHeader>
              <h3 className="text-gray-900">Top Diagnoses</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {diagnosisData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{item.diagnosis}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${(item.count / visits.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-gray-900 min-w-[2rem] text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {reportType === 'financial' && (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <DollarSign size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">Financial Reports</h3>
              <p className="text-gray-600">
                Financial reporting features would be implemented here, including:
              </p>
              <div className="mt-4 text-left max-w-md mx-auto space-y-2 text-gray-600">
                <p>• Revenue analysis by department</p>
                <p>• Payment collection rates</p>
                <p>• Outstanding balances</p>
                <p>• Insurance claims tracking</p>
                <p>• Expense management</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
