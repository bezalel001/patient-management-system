// Application constants

export const ROLES = {
  ADMIN: 'Administrator',
  DOCTOR: 'Doctor',
  NURSE: 'Nurse',
  LAB_TECH: 'Lab Technician',
  RADIOLOGIST: 'Radiologist',
  PHARMACIST: 'Pharmacist',
  RECEPTIONIST: 'Receptionist',
} as const;

export const GENDER_OPTIONS = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'O', label: 'Other' },
];

export const BLOOD_GROUP_OPTIONS = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

export const VISIT_TYPE_OPTIONS = [
  { value: 'OPD', label: 'Outpatient (OPD)' },
  { value: 'IPD', label: 'Inpatient (IPD)' },
];

export const VISIT_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'DISCHARGED', label: 'Discharged' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const ORDER_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export const PRIORITY_OPTIONS = [
  { value: 'ROUTINE', label: 'Routine' },
  { value: 'URGENT', label: 'Urgent' },
  { value: 'STAT', label: 'STAT' },
];

export const MEDICATION_ROUTE_OPTIONS = [
  { value: 'ORAL', label: 'Oral' },
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'SC', label: 'Subcutaneous (SC)' },
  { value: 'TOPICAL', label: 'Topical' },
  { value: 'INHALED', label: 'Inhaled' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'PAID', label: 'Paid' },
];

export const PAYMENT_METHOD_OPTIONS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'INSURANCE', label: 'Insurance' },
  { value: 'CHECK', label: 'Check' },
];

export const STATUS_COLORS = {
  ACTIVE: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  DISCHARGED: 'bg-gray-100 text-gray-800',
  CANCELLED: 'bg-red-100 text-red-800',
  PAID: 'bg-green-100 text-green-800',
  PARTIAL: 'bg-yellow-100 text-yellow-800',
  ROUTINE: 'bg-gray-100 text-gray-800',
  URGENT: 'bg-orange-100 text-orange-800',
  STAT: 'bg-red-100 text-red-800',
};
