import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle, Play } from 'lucide-react';
import { Appointment } from '../../types';
import { Badge } from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatters';

interface AppointmentCardProps {
  appointment: Appointment;
  onClick?: () => void;
  onCheckIn?: (appointmentId: string) => void;
  onCancel?: (appointmentId: string) => void;
  onCreateVisit?: (appointmentId: string) => void;
  showActions?: boolean;
}

export function AppointmentCard({ 
  appointment, 
  onClick, 
  onCheckIn, 
  onCancel,
  onCreateVisit,
  showActions = true 
}: AppointmentCardProps) {
  const getStatusBadge = () => {
    switch (appointment.status) {
      case 'SCHEDULED':
        return <Badge variant="info">Scheduled</Badge>;
      case 'CONFIRMED':
        return <Badge variant="success">Confirmed</Badge>;
      case 'CHECKED_IN':
        return <Badge variant="warning">Checked In</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">In Progress</Badge>;
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="error">Cancelled</Badge>;
      case 'NO_SHOW':
        return <Badge variant="error">No Show</Badge>;
      default:
        return <Badge variant="default">{appointment.status}</Badge>;
    }
  };

  const getAppointmentTypeBadge = () => {
    const typeColors: Record<string, 'info' | 'success' | 'warning' | 'error' | 'default'> = {
      'NEW_CONSULTATION': 'info',
      'FOLLOW_UP': 'success',
      'PROCEDURE': 'warning',
      'CHECK_UP': 'default',
    };

    const typeLabels: Record<string, string> = {
      'NEW_CONSULTATION': 'New',
      'FOLLOW_UP': 'Follow-up',
      'PROCEDURE': 'Procedure',
      'CHECK_UP': 'Check-up',
    };

    return (
      <Badge variant={typeColors[appointment.appointment_type]}>
        {typeLabels[appointment.appointment_type]}
      </Badge>
    );
  };

  const isToday = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointment.appointment_date === today;
  };

  const isPast = () => {
    const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`);
    return appointmentDateTime < new Date();
  };

  const canCheckIn = () => {
    return appointment.status === 'SCHEDULED' || appointment.status === 'CONFIRMED';
  };

  const canCreateVisit = () => {
    return appointment.status === 'CHECKED_IN' && !appointment.visit_created;
  };

  const canCancel = () => {
    return ['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && !isPast();
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${isToday() ? 'border-l-4 border-l-blue-500' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-sm text-gray-600">
              {appointment.appointment_number}
            </span>
            {getStatusBadge()}
            {getAppointmentTypeBadge()}
            {isToday() && <Badge variant="info">Today</Badge>}
          </div>
          <h4 className="text-gray-900 mb-1">
            {appointment.patient_details?.first_name} {appointment.patient_details?.last_name}
          </h4>
          <p className="text-sm text-gray-600">
            {appointment.patient_details?.mrn} • {appointment.patient_details?.age}
            {appointment.patient_details?.gender} • {appointment.patient_details?.phone}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <User size={16} className="text-gray-400" />
          <div>
            <span className="text-gray-600">Doctor: </span>
            <span className="text-gray-900">{appointment.doctor_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-gray-400" />
          <div>
            <span className="text-gray-600">Date: </span>
            <span className="text-gray-900">{formatDate(appointment.appointment_date)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-gray-400" />
          <div>
            <span className="text-gray-600">Time: </span>
            <span className="text-gray-900">
              {formatTime(appointment.appointment_time)} ({appointment.duration_minutes} min)
            </span>
          </div>
        </div>

        {appointment.doctor_specialization && (
          <div className="flex items-center gap-2 text-sm">
            <FileText size={16} className="text-gray-400" />
            <div>
              <span className="text-gray-600">Specialty: </span>
              <span className="text-gray-900">{appointment.doctor_specialization}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mb-3">
        <p className="text-sm text-gray-600 mb-1">Reason for Visit:</p>
        <p className="text-sm text-gray-900">{appointment.reason}</p>
      </div>

      {appointment.notes && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <p className="text-sm text-gray-600 mb-1">Notes:</p>
          <p className="text-sm text-gray-900">{appointment.notes}</p>
        </div>
      )}

      {appointment.visit_created && (
        <div className="mb-3 p-2 bg-green-50 rounded border border-green-200">
          <p className="text-sm text-green-800">
            <CheckCircle size={14} className="inline mr-1" />
            Visit created: {appointment.visit_number}
          </p>
        </div>
      )}

      {appointment.status === 'CANCELLED' && appointment.cancellation_reason && (
        <div className="mb-3 p-2 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-800">
            <XCircle size={14} className="inline mr-1" />
            Cancelled: {appointment.cancellation_reason}
          </p>
        </div>
      )}

      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-gray-200">
          {canCheckIn() && onCheckIn && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCheckIn(appointment.id);
              }}
              className="flex-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <CheckCircle size={16} />
              Check In
            </button>
          )}

          {canCreateVisit() && onCreateVisit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateVisit(appointment.id);
              }}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Play size={16} />
              Start Visit
            </button>
          )}

          {canCancel() && onCancel && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to cancel this appointment?')) {
                  onCancel(appointment.id);
                }
              }}
              className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors text-sm flex items-center justify-center gap-2"
            >
              <XCircle size={16} />
              Cancel
            </button>
          )}

          {appointment.status === 'COMPLETED' && (
            <div className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded text-sm text-center">
              <CheckCircle size={16} className="inline mr-1" />
              Completed
            </div>
          )}
        </div>
      )}
    </div>
  );
}
