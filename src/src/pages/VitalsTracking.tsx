import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Activity, AlertTriangle, TrendingUp, TrendingDown, Plus, Search } from 'lucide-react';
import { Visit, VitalSign } from '../types';
import { formatDateTime } from '../utils/formatters';
import { VitalsRecordingForm } from '../components/forms/VitalsRecordingForm';

interface VitalsTrackingProps {
  visits: Visit[];
  onVitalsRecorded?: (visitId: string, vitals: any) => void;
}

export function VitalsTracking({ visits, onVitalsRecorded }: VitalsTrackingProps) {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'abnormal'>('active');

  // Get active visits with latest vitals
  const activeVisits = visits.filter(v => v.status === 'ACTIVE');

  const getLatestVitals = (visit: Visit): VitalSign | null => {
    if (!visit.vital_signs || visit.vital_signs.length === 0) return null;
    return visit.vital_signs[visit.vital_signs.length - 1];
  };

  const isVitalAbnormal = (vitals: VitalSign | null): boolean => {
    if (!vitals) return false;
    
    // Check for abnormal vital signs
    const abnormalities = [];
    
    // Temperature (normal: 36.1-37.2°C)
    if (vitals.temperature_celsius && (vitals.temperature_celsius < 36.1 || vitals.temperature_celsius > 37.2)) {
      abnormalities.push('temp');
    }
    
    // Blood Pressure (normal systolic: 90-120, diastolic: 60-80)
    if (vitals.systolic_bp && (vitals.systolic_bp < 90 || vitals.systolic_bp > 140)) {
      abnormalities.push('bp');
    }
    if (vitals.diastolic_bp && (vitals.diastolic_bp < 60 || vitals.diastolic_bp > 90)) {
      abnormalities.push('bp');
    }
    
    // Heart Rate (normal: 60-100 bpm)
    if (vitals.heart_rate && (vitals.heart_rate < 60 || vitals.heart_rate > 100)) {
      abnormalities.push('hr');
    }
    
    // Oxygen Saturation (normal: 95-100%)
    if (vitals.oxygen_saturation && vitals.oxygen_saturation < 95) {
      abnormalities.push('spo2');
    }
    
    // Respiratory Rate (normal: 12-20 breaths/min)
    if (vitals.respiratory_rate && (vitals.respiratory_rate < 12 || vitals.respiratory_rate > 20)) {
      abnormalities.push('rr');
    }
    
    return abnormalities.length > 0;
  };

  const getTimeSinceLastVitals = (vitals: VitalSign | null): string => {
    if (!vitals) return 'Never';
    
    const now = new Date();
    const recorded = new Date(vitals.recorded_at);
    const diffMs = now.getTime() - recorded.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 24) {
      return `${Math.floor(diffHours / 24)}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  // Filter visits
  let filteredVisits = activeVisits;

  if (filterStatus === 'abnormal') {
    filteredVisits = filteredVisits.filter(v => {
      const vitals = getLatestVitals(v);
      return isVitalAbnormal(vitals);
    });
  }

  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    filteredVisits = filteredVisits.filter(visit => {
      const pd = visit.patient_details;
      return (
        visit.visit_number.toLowerCase().includes(searchLower) ||
        (pd && (
          pd.mrn.toLowerCase().includes(searchLower) ||
          pd.first_name.toLowerCase().includes(searchLower) ||
          pd.last_name.toLowerCase().includes(searchLower) ||
          `${pd.first_name} ${pd.last_name}`.toLowerCase().includes(searchLower)
        ))
      );
    });
  }

  const handleRecordVitals = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowRecordForm(true);
  };

  const handleVitalsSubmit = (vitalsData: any) => {
    if (selectedVisit) {
      onVitalsRecorded?.(selectedVisit.id, vitalsData);
    }
    setShowRecordForm(false);
    setSelectedVisit(null);
  };

  // Statistics
  const totalActive = activeVisits.length;
  const withRecentVitals = activeVisits.filter(v => {
    const vitals = getLatestVitals(v);
    if (!vitals) return false;
    const hoursSince = (new Date().getTime() - new Date(vitals.recorded_at).getTime()) / (1000 * 60 * 60);
    return hoursSince < 4; // Vitals within last 4 hours
  }).length;
  const withAbnormalVitals = activeVisits.filter(v => isVitalAbnormal(getLatestVitals(v))).length;
  const needingVitals = activeVisits.filter(v => !getLatestVitals(v)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Vitals Monitoring</h2>
        <p className="text-gray-600">Track and record vital signs for active patients</p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Patients</p>
                <p className="text-2xl text-gray-900 mt-1">{totalActive}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Activity className="text-blue-600" size={20} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Recent Vitals</p>
                <p className="text-2xl text-gray-900 mt-1">{withRecentVitals}</p>
                <p className="text-xs text-gray-500 mt-1">Last 4 hours</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={20} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Abnormal Vitals</p>
                <p className="text-2xl text-gray-900 mt-1">{withAbnormalVitals}</p>
                <p className="text-xs text-gray-500 mt-1">Require attention</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="text-red-600" size={20} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Needing Vitals</p>
                <p className="text-2xl text-gray-900 mt-1">{needingVitals}</p>
                <p className="text-xs text-gray-500 mt-1">No vitals yet</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <TrendingDown className="text-yellow-600" size={20} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by patient name, MRN, or visit number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'all'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'active'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterStatus('abnormal')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterStatus === 'abnormal'
                ? 'bg-red-100 text-red-600'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Abnormal ({withAbnormalVitals})
          </button>
        </div>
      </div>

      {/* Patients List */}
      <div className="space-y-3">
        {filteredVisits.length > 0 ? (
          filteredVisits.map(visit => {
            const latestVitals = getLatestVitals(visit);
            const isAbnormal = isVitalAbnormal(latestVitals);
            const timeSince = getTimeSinceLastVitals(latestVitals);
            const pd = visit.patient_details;

            return (
              <Card key={visit.id} className={isAbnormal ? 'border-l-4 border-red-500' : ''}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-gray-900">
                          {pd?.first_name} {pd?.last_name}
                        </h4>
                        <Badge status={visit.visit_type === 'IPD' ? 'info' : 'warning'}>
                          {visit.visit_type}
                        </Badge>
                        {isAbnormal && (
                          <Badge status="error">
                            <AlertTriangle size={12} className="inline mr-1" />
                            Abnormal
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>MRN: {pd?.mrn} • Visit: {visit.visit_number}</div>
                        {visit.bed_number && <div>Bed: {visit.bed_number} • Ward: {visit.ward}</div>}
                        <div>Last vitals: {timeSince}</div>
                      </div>

                      {latestVitals && (
                        <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                          <div className="text-sm">
                            <span className="text-gray-500">Temp:</span>
                            <span className={`ml-1 ${
                              latestVitals.temperature_celsius && 
                              (latestVitals.temperature_celsius < 36.1 || latestVitals.temperature_celsius > 37.2)
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              {latestVitals.temperature_celsius}°C
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">BP:</span>
                            <span className={`ml-1 ${
                              latestVitals.systolic_bp && 
                              (latestVitals.systolic_bp < 90 || latestVitals.systolic_bp > 140)
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              {latestVitals.systolic_bp}/{latestVitals.diastolic_bp}
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">HR:</span>
                            <span className={`ml-1 ${
                              latestVitals.heart_rate && 
                              (latestVitals.heart_rate < 60 || latestVitals.heart_rate > 100)
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              {latestVitals.heart_rate} bpm
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">SpO2:</span>
                            <span className={`ml-1 ${
                              latestVitals.oxygen_saturation && latestVitals.oxygen_saturation < 95
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              {latestVitals.oxygen_saturation}%
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">RR:</span>
                            <span className={`ml-1 ${
                              latestVitals.respiratory_rate && 
                              (latestVitals.respiratory_rate < 12 || latestVitals.respiratory_rate > 20)
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              {latestVitals.respiratory_rate}/min
                            </span>
                          </div>
                          <div className="text-sm">
                            <span className="text-gray-500">BMI:</span>
                            <span className="ml-1 text-gray-900">
                              {latestVitals.bmi?.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleRecordVitals(visit)}
                      className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 whitespace-nowrap"
                    >
                      <Plus size={16} />
                      Record Vitals
                    </button>
                  </div>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardBody>
              <div className="text-center py-8 text-gray-500">
                No patients found matching your filters.
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Vitals Recording Form */}
      {showRecordForm && selectedVisit && (
        <VitalsRecordingForm
          onClose={() => {
            setShowRecordForm(false);
            setSelectedVisit(null);
          }}
          onSubmit={handleVitalsSubmit}
        />
      )}
    </div>
  );
}
