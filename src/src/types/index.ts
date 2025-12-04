// Core TypeScript interfaces for MediFlow

export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'LAB_TECH' | 'RADIOLOGIST' | 'PHARMACIST' | 'RECEPTIONIST';
  phone?: string;
  license_number?: string;
  specialization?: string;
  is_active: boolean;
}

export interface Patient {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  blood_group?: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  state?: string;
  postal_code?: string;
  allergies?: string;
  medical_history?: string;
  current_medications?: string;
  insurance_provider?: string;
  insurance_number?: string;
  emergency_contacts?: EmergencyContact[];
  is_active: boolean;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  alternate_phone?: string;
}

export interface Visit {
  id: string;
  visit_number: string;
  patient: string;
  patient_details?: PatientSummary;
  visit_type: 'OPD' | 'IPD';
  admission_datetime: string;
  discharge_datetime?: string;
  duration_days: number;
  chief_complaint: string;
  history_of_present_illness?: string;
  physical_examination?: string;
  diagnosis?: string;
  treatment_plan?: string;
  bed_number?: string;
  ward?: string;
  status: 'ACTIVE' | 'DISCHARGED' | 'CANCELLED';
  assigned_doctors: string[];
  assigned_doctor_names?: string[];
  assigned_doctors_details?: User[];
  assigned_nurses: string[];
  assigned_nurse_names?: string[];
  assigned_nurses_details?: User[];
  vital_signs?: VitalSigns[];
  lab_orders?: LabOrder[];
  radiology_orders?: RadiologyOrder[];
  medication_orders?: MedicationOrder[];
  discharge_summary?: DischargeSummary;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientSummary {
  id: string;
  mrn: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  phone: string;
  created_at: string;
}

export interface VitalSigns {
  id: string;
  visit: string;
  temperature_celsius?: number;
  systolic_bp?: number;
  diastolic_bp?: number;
  heart_rate?: number;
  respiratory_rate?: number;
  oxygen_saturation?: number;
  weight_kg?: number;
  height_cm?: number;
  bmi?: number;
  notes?: string;
  recorded_by: string;
  recorded_by_name?: string;
  recorded_at: string;
}

export type VitalSign = VitalSigns;

export interface LabOrder {
  id: string;
  order_number: string;
  visit: string;
  test_name: string;
  test_category: string;
  clinical_notes?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  ordered_by: string;
  ordered_by_name?: string;
  technician?: string;
  technician_name?: string;
  ordered_at: string;
  completed_at?: string;
  results?: LabResult[];
}

export interface LabResult {
  id: string;
  parameter_name: string;
  result_value: string;
  unit?: string;
  reference_range?: string;
  is_abnormal: boolean;
  notes?: string;
  created_at: string;
}

export interface RadiologyOrder {
  id: string;
  order_number: string;
  visit: string;
  study_type: string;
  body_part: string;
  clinical_indication: string;
  status: 'PENDING' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  priority: 'ROUTINE' | 'URGENT' | 'STAT';
  report?: string;
  image_url?: string;
  ordered_by: string;
  ordered_by_name?: string;
  radiologist?: string;
  radiologist_name?: string;
  ordered_at: string;
  scheduled_at?: string;
  completed_at?: string;
}

export interface MedicationOrder {
  id: string;
  order_number: string;
  visit: string;
  medication_name: string;
  dosage: string;
  route: 'ORAL' | 'IV' | 'IM' | 'SC' | 'TOPICAL' | 'INHALED';
  frequency: string;
  duration_days: number;
  instructions?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  prescribed_by: string;
  prescribed_by_name?: string;
  dispensed_by?: string;
  dispensed_by_name?: string;
  prescribed_at: string;
  dispensed_at?: string;
}

export interface DischargeSummary {
  id: string;
  visit: string;
  visit_number?: string;
  patient_name?: string;
  admission_date: string;
  discharge_date: string;
  final_diagnosis: string;
  hospital_course: string;
  procedures_performed?: string;
  discharge_medications: string;
  follow_up_instructions: string;
  diet_restrictions?: string;
  activity_restrictions?: string;
  prepared_by: string;
  prepared_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Bill {
  id: string;
  bill_number: string;
  visit: string;
  visit_number?: string;
  patient: string;
  patient_name?: string;
  consultation_fee: number;
  lab_charges: number;
  radiology_charges: number;
  medication_charges: number;
  bed_charges: number;
  procedure_charges: number;
  other_charges: number;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  payment_status: 'PENDING' | 'PARTIAL' | 'PAID';
  payment_method?: 'CASH' | 'CARD' | 'UPI' | 'INSURANCE' | 'CHECK';
  notes?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  appointment_number: string;
  patient: string;
  patient_details?: PatientSummary;
  doctor: string;
  doctor_name?: string;
  doctor_specialization?: string;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  appointment_type: 'NEW_CONSULTATION' | 'FOLLOW_UP' | 'PROCEDURE' | 'CHECK_UP';
  reason: string;
  notes?: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  visit_created?: string;
  visit_number?: string;
  created_by: string;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface DoctorSchedule {
  id: string;
  doctor: string;
  doctor_name?: string;
  day_of_week: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
  max_patients_per_slot: number;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}
