import { useState } from 'react';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { TestTube, Package, FileText, Clock, CheckCircle, XCircle, AlertCircle, Filter } from 'lucide-react';
import { Visit, LabOrder, MedicationOrder, RadiologyOrder, User } from '../types';
import { formatDateTime } from '../utils/formatters';
import { LabResultForm } from '../components/forms/LabResultForm';
import { MedicationDispenseForm } from '../components/forms/MedicationDispenseForm';
import { RadiologyReportForm } from '../components/forms/RadiologyReportForm';

interface OrdersManagementProps {
  visits: Visit[];
  currentUser: User;
  onLabOrderUpdated?: (orderId: string, updates: any) => void;
  onMedicationUpdated?: (orderId: string, updates: any) => void;
  onRadiologyOrderUpdated?: (orderId: string, updates: any) => void;
}

type OrderType = 'all' | 'lab' | 'medication' | 'radiology';
type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed';

export function OrdersManagement({ visits, currentUser, onLabOrderUpdated, onMedicationUpdated, onRadiologyOrderUpdated }: OrdersManagementProps) {
  const [orderType, setOrderType] = useState<OrderType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedLabOrder, setSelectedLabOrder] = useState<LabOrder | null>(null);
  const [selectedMedOrder, setSelectedMedOrder] = useState<MedicationOrder | null>(null);
  const [selectedRadOrder, setSelectedRadOrder] = useState<RadiologyOrder | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  // Determine what order types the user can see based on their role
  const getAvailableOrderTypes = () => {
    switch (currentUser.role) {
      case 'LAB_TECH':
        return ['lab'];
      case 'PHARMACIST':
        return ['medication'];
      case 'RADIOLOGIST':
        return ['radiology'];
      case 'DOCTOR':
      case 'NURSE':
      case 'ADMIN':
        return ['all', 'lab', 'medication', 'radiology'];
      default:
        return ['all'];
    }
  };

  // Collect all orders from visits
  const allLabOrders: (LabOrder & { visit: Visit })[] = [];
  const allMedicationOrders: (MedicationOrder & { visit: Visit })[] = [];
  const allRadiologyOrders: (RadiologyOrder & { visit: Visit })[] = [];

  visits.forEach(visit => {
    if (visit.lab_orders) {
      visit.lab_orders.forEach(order => {
        allLabOrders.push({ ...order, visit });
      });
    }
    if (visit.medication_orders) {
      visit.medication_orders.forEach(order => {
        allMedicationOrders.push({ ...order, visit });
      });
    }
    if (visit.radiology_orders) {
      visit.radiology_orders.forEach(order => {
        allRadiologyOrders.push({ ...order, visit });
      });
    }
  });

  // Apply filters
  const filterByStatus = (status: string) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'pending') return status === 'PENDING';
    if (statusFilter === 'in-progress') return status === 'IN_PROGRESS' || status === 'SCHEDULED';
    if (statusFilter === 'completed') return status === 'COMPLETED';
    return true;
  };

  const filteredLabOrders = allLabOrders.filter(order => filterByStatus(order.status));
  const filteredMedicationOrders = allMedicationOrders.filter(order => filterByStatus(order.status === 'ACTIVE' ? 'PENDING' : order.status));
  const filteredRadiologyOrders = allRadiologyOrders.filter(order => filterByStatus(order.status));

  const availableTypes = getAvailableOrderTypes();

  // Auto-select appropriate order type based on role
  const effectiveOrderType = availableTypes.includes(orderType) ? orderType : availableTypes[0] as OrderType;

  const handleLabOrderClick = (order: LabOrder & { visit: Visit }) => {
    if (currentUser.role === 'LAB_TECH' || currentUser.role === 'ADMIN') {
      setSelectedLabOrder(order);
      setSelectedVisit(order.visit);
    }
  };

  const handleMedicationClick = (order: MedicationOrder & { visit: Visit }) => {
    if (currentUser.role === 'PHARMACIST' || currentUser.role === 'ADMIN') {
      setSelectedMedOrder(order);
      setSelectedVisit(order.visit);
    }
  };

  const handleRadiologyClick = (order: RadiologyOrder & { visit: Visit }) => {
    if (currentUser.role === 'RADIOLOGIST' || currentUser.role === 'ADMIN') {
      setSelectedRadOrder(order);
      setSelectedVisit(order.visit);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="text-yellow-600" size={16} />;
      case 'IN_PROGRESS':
      case 'SCHEDULED':
        return <AlertCircle className="text-blue-600" size={16} />;
      case 'COMPLETED':
      case 'DISPENSED':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'CANCELLED':
      case 'DISCONTINUED':
        return <XCircle className="text-red-600" size={16} />;
      default:
        return <Clock className="text-gray-600" size={16} />;
    }
  };

  const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case 'PENDING':
      case 'ACTIVE':
        return 'warning';
      case 'IN_PROGRESS':
      case 'SCHEDULED':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
      case 'DISCONTINUED':
        return 'error';
      default:
        return 'info';
    }
  };

  const stats = {
    lab: {
      total: allLabOrders.length,
      pending: allLabOrders.filter(o => o.status === 'PENDING').length,
      inProgress: allLabOrders.filter(o => o.status === 'IN_PROGRESS').length,
      completed: allLabOrders.filter(o => o.status === 'COMPLETED').length,
    },
    medication: {
      total: allMedicationOrders.length,
      pending: allMedicationOrders.filter(o => o.status === 'ACTIVE' && !o.dispensed_at).length,
      dispensed: allMedicationOrders.filter(o => o.dispensed_at).length,
      completed: allMedicationOrders.filter(o => o.status === 'COMPLETED').length,
    },
    radiology: {
      total: allRadiologyOrders.length,
      pending: allRadiologyOrders.filter(o => o.status === 'PENDING').length,
      scheduled: allRadiologyOrders.filter(o => o.status === 'SCHEDULED').length,
      completed: allRadiologyOrders.filter(o => o.status === 'COMPLETED').length,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900">Orders Management</h2>
        <p className="text-gray-600">
          {currentUser.role === 'LAB_TECH' && 'Manage laboratory test orders'}
          {currentUser.role === 'PHARMACIST' && 'Manage medication dispensing'}
          {currentUser.role === 'RADIOLOGIST' && 'Manage radiology studies'}
          {(currentUser.role === 'DOCTOR' || currentUser.role === 'NURSE' || currentUser.role === 'ADMIN') && 'View and manage all orders'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(effectiveOrderType === 'all' || effectiveOrderType === 'lab') && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TestTube size={16} />
                    <span className="text-sm">Lab Orders</span>
                  </div>
                  <div className="text-2xl text-gray-900">{stats.lab.total}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats.lab.pending} pending • {stats.lab.inProgress} in progress
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {(effectiveOrderType === 'all' || effectiveOrderType === 'medication') && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Package size={16} />
                    <span className="text-sm">Medications</span>
                  </div>
                  <div className="text-2xl text-gray-900">{stats.medication.total}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats.medication.pending} to dispense • {stats.medication.dispensed} dispensed
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {(effectiveOrderType === 'all' || effectiveOrderType === 'radiology') && (
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <FileText size={16} />
                    <span className="text-sm">Radiology Studies</span>
                  </div>
                  <div className="text-2xl text-gray-900">{stats.radiology.total}</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {stats.radiology.pending} pending • {stats.radiology.scheduled} scheduled
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Order Type Filter - only show if user has access to multiple types */}
        {availableTypes.length > 1 && (
          <div className="flex gap-2">
            {availableTypes.map(type => (
              <button
                key={type}
                onClick={() => setOrderType(type as OrderType)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  effectiveOrderType === type
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'all' && 'All Orders'}
                {type === 'lab' && 'Lab Orders'}
                {type === 'medication' && 'Medications'}
                {type === 'radiology' && 'Radiology'}
              </button>
            ))}
          </div>
        )}

        {/* Status Filter */}
        <div className="flex gap-2 border-l border-gray-300 pl-3">
          <Filter size={16} className="text-gray-400 self-center" />
          {(['all', 'pending', 'in-progress', 'completed'] as StatusFilter[]).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                statusFilter === status
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status === 'all' && 'All'}
              {status === 'pending' && 'Pending'}
              {status === 'in-progress' && 'In Progress'}
              {status === 'completed' && 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {/* Lab Orders */}
        {(effectiveOrderType === 'all' || effectiveOrderType === 'lab') && (
          <>
            {filteredLabOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <TestTube size={20} />
                  Laboratory Orders ({filteredLabOrders.length})
                </h3>
                {filteredLabOrders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleLabOrderClick(order)}>
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-900">{order.test_name}</span>
                            <Badge status={getStatusColor(order.status)}>{order.status}</Badge>
                            <Badge status={order.priority === 'STAT' ? 'error' : 'info'}>{order.priority}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Order #: {order.order_number}</div>
                            <div>Patient: {order.visit.patient_details?.first_name} {order.visit.patient_details?.last_name} ({order.visit.patient_details?.mrn})</div>
                            <div>Category: {order.test_category}</div>
                            {order.clinical_notes && <div>Notes: {order.clinical_notes}</div>}
                            <div className="text-xs text-gray-500">
                              Ordered by {order.ordered_by_name || 'Unknown'} • {formatDateTime(order.ordered_at)}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusIcon(order.status)}
                        </div>
                      </div>
                      {order.results && order.results.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            <strong>Results:</strong> {order.results.length} parameter(s) recorded
                            {order.results.some(r => r.is_abnormal) && (
                              <span className="ml-2 text-red-600">• Contains abnormal values</span>
                            )}
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Medication Orders */}
        {(effectiveOrderType === 'all' || effectiveOrderType === 'medication') && (
          <>
            {filteredMedicationOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Package size={20} />
                  Medication Orders ({filteredMedicationOrders.length})
                </h3>
                {filteredMedicationOrders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleMedicationClick(order)}>
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-900">{order.medication_name} {order.dosage}</span>
                            <Badge status={getStatusColor(order.status)}>{order.status}</Badge>
                            {order.dispensed_at && <Badge status="success">Dispensed</Badge>}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Order #: {order.order_number}</div>
                            <div>Patient: {order.visit.patient_details?.first_name} {order.visit.patient_details?.last_name} ({order.visit.patient_details?.mrn})</div>
                            <div>Route: {order.route} • Frequency: {order.frequency} • Duration: {order.duration_days} days</div>
                            {order.instructions && <div>Instructions: {order.instructions}</div>}
                            <div className="text-xs text-gray-500">
                              Prescribed by {order.prescribed_by_name || 'Unknown'} • {formatDateTime(order.prescribed_at)}
                            </div>
                            {order.dispensed_at && (
                              <div className="text-xs text-green-600">
                                Dispensed by {order.dispensed_by_name || 'Unknown'} • {formatDateTime(order.dispensed_at)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusIcon(order.dispensed_at ? 'DISPENSED' : order.status)}
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Radiology Orders */}
        {(effectiveOrderType === 'all' || effectiveOrderType === 'radiology') && (
          <>
            {filteredRadiologyOrders.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <FileText size={20} />
                  Radiology Orders ({filteredRadiologyOrders.length})
                </h3>
                {filteredRadiologyOrders.map(order => (
                  <Card key={order.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRadiologyClick(order)}>
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-900">{order.study_type} - {order.body_part}</span>
                            <Badge status={getStatusColor(order.status)}>{order.status}</Badge>
                            <Badge status={order.priority === 'STAT' ? 'error' : 'info'}>{order.priority}</Badge>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>Order #: {order.order_number}</div>
                            <div>Patient: {order.visit.patient_details?.first_name} {order.visit.patient_details?.last_name} ({order.visit.patient_details?.mrn})</div>
                            <div>Indication: {order.clinical_indication}</div>
                            <div className="text-xs text-gray-500">
                              Ordered by {order.ordered_by_name || 'Unknown'} • {formatDateTime(order.ordered_at)}
                            </div>
                            {order.scheduled_at && (
                              <div className="text-xs text-blue-600">
                                Scheduled for {formatDateTime(order.scheduled_at)}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="ml-4">
                          {getStatusIcon(order.status)}
                        </div>
                      </div>
                      {order.report && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                            <strong>Report:</strong> {order.report.substring(0, 100)}...
                          </div>
                        </div>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}

        {/* Empty State */}
        {filteredLabOrders.length === 0 && filteredMedicationOrders.length === 0 && filteredRadiologyOrders.length === 0 && (
          <Card>
            <CardBody>
              <div className="text-center py-8 text-gray-500">
                No orders found matching your filters.
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Forms */}
      {selectedLabOrder && selectedVisit && (
        <LabResultForm
          order={selectedLabOrder}
          visit={selectedVisit}
          onClose={() => {
            setSelectedLabOrder(null);
            setSelectedVisit(null);
          }}
          onSubmit={(results) => {
            onLabOrderUpdated?.(selectedLabOrder.id, { results, status: 'COMPLETED' });
            setSelectedLabOrder(null);
            setSelectedVisit(null);
          }}
        />
      )}

      {selectedMedOrder && selectedVisit && (
        <MedicationDispenseForm
          order={selectedMedOrder}
          visit={selectedVisit}
          currentUser={currentUser}
          onClose={() => {
            setSelectedMedOrder(null);
            setSelectedVisit(null);
          }}
          onSubmit={(data) => {
            onMedicationUpdated?.(selectedMedOrder.id, data);
            setSelectedMedOrder(null);
            setSelectedVisit(null);
          }}
        />
      )}

      {selectedRadOrder && selectedVisit && (
        <RadiologyReportForm
          order={selectedRadOrder}
          visit={selectedVisit}
          currentUser={currentUser}
          onClose={() => {
            setSelectedRadOrder(null);
            setSelectedVisit(null);
          }}
          onSubmit={(data) => {
            onRadiologyOrderUpdated?.(selectedRadOrder.id, data);
            setSelectedRadOrder(null);
            setSelectedVisit(null);
          }}
        />
      )}
    </div>
  );
}
