import { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, FileText } from 'lucide-react';
import { Patient, User as UserType, Appointment } from '../../types';

interface AppointmentBookingFormProps {
  onSubmit: (data: Partial<Appointment>) => void;
  onCancel: () => void;
  patients: Patient[];
  doctors: UserType[];
  selectedPatient?: Patient;
}

export function AppointmentBookingForm({ 
  onSubmit, 
  onCancel, 
  patients, 
  doctors,
  selectedPatient 
}: AppointmentBookingFormProps) {
  const [formData, setFormData] = useState({
    patient: selectedPatient?.id || '',
    doctor: '',
    appointment_date: '',
    appointment_time: '',
    duration_minutes: 30,
    appointment_type: 'NEW_CONSULTATION' as const,
    reason: '',
    notes: '',
  });

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<UserType | null>(null);

  useEffect(() => {
    if (formData.doctor && formData.appointment_date) {
      generateTimeSlots();
    }
  }, [formData.doctor, formData.appointment_date]);

  const generateTimeSlots = () => {
    // Generate time slots from 8 AM to 5 PM with 30-minute intervals
    const slots: string[] = [];
    for (let hour = 8; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(timeStr);
      }
    }
    setAvailableSlots(slots);
  };

  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    setSelectedDoctor(doctor || null);
    setFormData({ ...formData, doctor: doctorId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPatientData = patients.find(p => p.id === formData.patient);
    const appointment_number = `AP-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const appointmentData: Partial<Appointment> = {
      appointment_number,
      patient: formData.patient,
      patient_details: selectedPatientData ? {
        id: selectedPatientData.id,
        mrn: selectedPatientData.mrn,
        first_name: selectedPatientData.first_name,
        last_name: selectedPatientData.last_name,
        age: selectedPatientData.age,
        gender: selectedPatientData.gender,
        phone: selectedPatientData.phone,
        created_at: selectedPatientData.created_at,
      } : undefined,
      doctor: formData.doctor,
      doctor_name: selectedDoctor?.full_name,
      doctor_specialization: selectedDoctor?.specialization,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      duration_minutes: formData.duration_minutes,
      appointment_type: formData.appointment_type,
      reason: formData.reason,
      notes: formData.notes,
      status: 'SCHEDULED',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    onSubmit(appointmentData);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-gray-900">Book Appointment</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Patient Selection */}
          <div>
            <label className="block text-gray-700 mb-2">
              Patient <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                required
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!!selectedPatient}
              >
                <option value="">Select Patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctor Selection */}
          <div>
            <label className="block text-gray-700 mb-2">
              Doctor <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                required
                value={formData.doctor}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Doctor</option>
                {doctors.filter(d => d.role === 'DOCTOR').map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.full_name} {doctor.specialization ? `- ${doctor.specialization}` : ''}
                  </option>
                ))}
              </select>
            </div>
            {selectedDoctor && (
              <p className="mt-2 text-sm text-gray-600">
                Specialization: {selectedDoctor.specialization || 'General Medicine'}
              </p>
            )}
          </div>

          {/* Appointment Type */}
          <div>
            <label className="block text-gray-700 mb-2">
              Appointment Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.appointment_type}
              onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value as any })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NEW_CONSULTATION">New Consultation</option>
              <option value="FOLLOW_UP">Follow-up Visit</option>
              <option value="PROCEDURE">Procedure</option>
              <option value="CHECK_UP">Regular Check-up</option>
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-2">
                Appointment Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="date"
                  required
                  min={getTodayDate()}
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Appointment Time <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <select
                  required
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Time</option>
                  {availableSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-gray-700 mb-2">
              Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.duration_minutes}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-gray-700 mb-2">
              Reason for Visit <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 text-gray-400" size={20} />
              <textarea
                required
                rows={3}
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Brief description of symptoms or reason for appointment"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or additional information"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
