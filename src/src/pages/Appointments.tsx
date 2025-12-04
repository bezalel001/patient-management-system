import { useState } from 'react';
import { Calendar, Plus, Search, Filter, Clock, CheckCircle, XCircle, Users } from 'lucide-react';
import { Appointment, Patient, User } from '../types';
import { AppointmentCard } from '../components/appointments/AppointmentCard';
import { AppointmentBookingForm } from '../components/forms/AppointmentBookingForm';
import { Card, CardBody } from '../components/common/Card';
import { SearchFilter } from '../components/common/SearchFilter';
import { Badge } from '../components/common/Badge';

interface AppointmentsProps {
  userRole: string;
  appointments: Appointment[];
  patients: Patient[];
  doctors: User[];
  onCreateAppointment: (appointment: Partial<Appointment>) => void;
  onCheckIn: (appointmentId: string) => void;
  onCancel: (appointmentId: string) => void;
  onCreateVisit: (appointmentId: string) => void;
}

export function Appointments({
  userRole,
  appointments,
  patients,
  doctors,
  onCreateAppointment,
  onCheckIn,
  onCancel,
  onCreateVisit,
}: AppointmentsProps) {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'TODAY' | 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [doctorFilter, setDoctorFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'TOMORROW' | 'THIS_WEEK' | 'NEXT_WEEK'>('ALL');

  const handleBookingSubmit = (data: Partial<Appointment>) => {
    onCreateAppointment(data);
    setShowBookingForm(false);
  };

  const getFilteredAppointments = () => {
    let filtered = [...appointments];

    // Date filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    const nextWeekEnd = new Date(today);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 14);

    if (dateFilter === 'TODAY') {
      const todayStr = today.toISOString().split('T')[0];
      filtered = filtered.filter(a => a.appointment_date === todayStr);
    } else if (dateFilter === 'TOMORROW') {
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      filtered = filtered.filter(a => a.appointment_date === tomorrowStr);
    } else if (dateFilter === 'THIS_WEEK') {
      const weekEndStr = weekEnd.toISOString().split('T')[0];
      filtered = filtered.filter(a => a.appointment_date >= today.toISOString().split('T')[0] && a.appointment_date <= weekEndStr);
    } else if (dateFilter === 'NEXT_WEEK') {
      const weekEndStr = weekEnd.toISOString().split('T')[0];
      const nextWeekEndStr = nextWeekEnd.toISOString().split('T')[0];
      filtered = filtered.filter(a => a.appointment_date > weekEndStr && a.appointment_date <= nextWeekEndStr);
    }

    // Status filter
    if (statusFilter === 'TODAY') {
      const todayStr = today.toISOString().split('T')[0];
      filtered = filtered.filter(a => a.appointment_date === todayStr);
    } else if (statusFilter !== 'ALL') {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    // Doctor filter
    if (doctorFilter !== 'ALL') {
      filtered = filtered.filter(a => a.doctor === doctorFilter);
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(a =>
        a.appointment_number.toLowerCase().includes(searchLower) ||
        a.patient_details?.first_name.toLowerCase().includes(searchLower) ||
        a.patient_details?.last_name.toLowerCase().includes(searchLower) ||
        a.patient_details?.mrn.toLowerCase().includes(searchLower) ||
        a.doctor_name?.toLowerCase().includes(searchLower) ||
        a.reason.toLowerCase().includes(searchLower)
      );
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`);
      return dateA.getTime() - dateB.getTime();
    });

    return filtered;
  };

  const filteredAppointments = getFilteredAppointments();

  const getStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    return {
      total: appointments.length,
      today: appointments.filter(a => a.appointment_date === today).length,
      scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
      confirmed: appointments.filter(a => a.status === 'CONFIRMED').length,
      checkedIn: appointments.filter(a => a.status === 'CHECKED_IN').length,
      completed: appointments.filter(a => a.status === 'COMPLETED').length,
      cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
    };
  };

  const stats = getStatistics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900">Appointments</h2>
          <p className="text-gray-600">
            {appointments.length} total appointments • {stats.today} today
          </p>
        </div>
        {['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(userRole) && (
          <button
            onClick={() => setShowBookingForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Book Appointment
          </button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Appointments</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="text-blue-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Checked In</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.checkedIn}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.cancelled}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="text-red-600" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <SearchFilter
          placeholder="Search by appointment number, patient name, MRN, or doctor..."
          onSearch={setSearchTerm}
        />

        <div className="flex flex-wrap gap-3">
          {/* Date Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setDateFilter('ALL')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Dates
            </button>
            <button
              onClick={() => setDateFilter('TODAY')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateFilter === 'TODAY'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateFilter('TOMORROW')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateFilter === 'TOMORROW'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setDateFilter('THIS_WEEK')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dateFilter === 'THIS_WEEK'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Status
            </button>
            <button
              onClick={() => setStatusFilter('SCHEDULED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'SCHEDULED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Scheduled
            </button>
            <button
              onClick={() => setStatusFilter('CHECKED_IN')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'CHECKED_IN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Checked In
            </button>
            <button
              onClick={() => setStatusFilter('COMPLETED')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                statusFilter === 'COMPLETED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Doctor Filter */}
          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="ALL">All Doctors</option>
            {doctors.filter(d => d.role === 'DOCTOR').map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onCheckIn={onCheckIn}
              onCancel={onCancel}
              onCreateVisit={onCreateVisit}
              showActions={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole)}
            />
          ))
        ) : appointments.length === 0 ? (
          <Card>
            <CardBody>
              <div className="text-center py-8">
                <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-500 mb-4">No appointments scheduled yet.</p>
                {['ADMIN', 'DOCTOR', 'RECEPTIONIST'].includes(userRole) && (
                  <button
                    onClick={() => setShowBookingForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book First Appointment
                  </button>
                )}
              </div>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <div className="text-center py-8 text-gray-500">
                No appointments found matching your filters.
              </div>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <AppointmentBookingForm
          onSubmit={handleBookingSubmit}
          onCancel={() => setShowBookingForm(false)}
          patients={patients}
          doctors={doctors}
        />
      )}
    </div>
  );
}
