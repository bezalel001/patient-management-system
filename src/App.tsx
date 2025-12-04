import { useState, useEffect } from 'react';
import { Sidebar } from './src/components/layout/Sidebar';
import { Header } from './src/components/layout/Header';
import { Dashboard } from './src/pages/Dashboard';
import { PatientDetail } from './src/pages/PatientDetail';
import { VisitDetail } from './src/pages/VisitDetail';
import { OrdersManagement } from './src/pages/OrdersManagement';
import { Reports } from './src/pages/Reports';
import { VitalsTracking } from './src/pages/VitalsTracking';
import { Settings } from './src/pages/Settings';
import { Appointments } from './src/pages/Appointments';
import { PatientCard } from './src/components/patients/PatientCard';
import { VisitCard } from './src/components/visits/VisitCard';
import { Card, CardHeader, CardBody } from './src/components/common/Card';
import { BillSummary } from './src/components/billing/BillSummary';
import { PatientRegistrationForm } from './src/components/forms/PatientRegistrationForm';
import { VisitCreationForm } from './src/components/forms/VisitCreationForm';
import { VitalsRecordingForm } from './src/components/forms/VitalsRecordingForm';
import { User, Patient, Visit, Bill, VitalSign, Appointment } from './src/types';
import { Plus } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { SearchFilter } from './src/components/common/SearchFilter';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const [vitalsVisitContext, setVitalsVisitContext] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [visitSearchTerm, setVisitSearchTerm] = useState('');
  const [visitFilter, setVisitFilter] = useState<'ALL' | 'TODAY' | 'ACTIVE' | 'DISCHARGED'>('ALL');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Mock user - in real app, this would come from authentication
  const currentUser: User = {
    id: '1',
    username: 'dr_okafor',
    email: 'okafor@mediflow.com',
    first_name: 'Chinedu',
    last_name: 'Okafor',
    full_name: 'Dr. Chinedu Okafor',
    role: 'DOCTOR',
    license_number: 'MD-12345',
    specialization: 'General Medicine',
    is_active: true,
  };

  // Mock data
  const mockPatients: Patient[] = [
    {
      id: '1',
      mrn: 'MR-2025-000123',
      first_name: 'Aisha',
      last_name: 'Bello',
      date_of_birth: '1985-05-15',
      age: 39,
      gender: 'F',
      blood_group: 'O+',
      phone: '+234 (802) 123-4567',
      email: 'aisha.b@email.com',
      address: '123 Allen Avenue, Ikeja',
      city: 'Lagos',
      state: 'Lagos State',
      postal_code: '100001',
      allergies: 'Penicillin, Latex',
      medical_history: 'Hypertension (controlled), Type 2 Diabetes',
      current_medications: 'Metformin 500mg BID, Lisinopril 10mg OD',
      insurance_provider: 'NHIS',
      insurance_number: 'NHIS-123456789',
      is_active: true,
      created_by: '1',
      created_by_name: 'Dr. Chinedu Okafor',
      created_at: '2025-01-15T10:30:00Z',
      updated_at: '2025-01-15T10:30:00Z',
    },
    {
      id: '2',
      mrn: 'MR-2025-000124',
      first_name: 'Tunde',
      last_name: 'Adeyemi',
      date_of_birth: '1972-11-20',
      age: 52,
      gender: 'M',
      blood_group: 'A+',
      phone: '+234 (803) 234-5678',
      address: '456 Victoria Island',
      city: 'Lagos',
      state: 'Lagos State',
      postal_code: '101001',
      allergies: 'None known',
      is_active: true,
      created_by: '1',
      created_at: '2025-02-10T14:20:00Z',
      updated_at: '2025-02-10T14:20:00Z',
    },
    {
      id: '3',
      mrn: 'MR-2025-000125',
      first_name: 'Ifeoma',
      last_name: 'Nwosu',
      date_of_birth: '1990-03-08',
      age: 34,
      gender: 'F',
      blood_group: 'B+',
      phone: '+234 (805) 345-6789',
      address: '789 Lekki Phase 1',
      city: 'Lagos',
      state: 'Lagos State',
      postal_code: '105102',
      allergies: 'Shellfish, Aspirin',
      medical_history: 'Asthma',
      current_medications: 'Albuterol inhaler PRN',
      is_active: true,
      created_by: '1',
      created_at: '2025-11-25T09:15:00Z',
      updated_at: '2025-11-25T09:15:00Z',
    },
  ];

  const mockVisits: Visit[] = [
    {
      id: '1',
      visit_number: 'VS-2025-000201',
      patient: '1',
      patient_details: {
        id: '1',
        mrn: 'MR-2025-000123',
        first_name: 'Aisha',
        last_name: 'Bello',
        age: 39,
        gender: 'F',
        phone: '+234 (802) 123-4567',
        created_at: '2025-01-15T10:30:00Z',
      },
      visit_type: 'OPD',
      admission_datetime: '2025-12-03T09:30:00Z',
      duration_days: 0,
      chief_complaint: 'Fever and persistent cough for 5 days',
      history_of_present_illness: 'Patient reports gradual onset of fever (max 101°F) and dry cough. No shortness of breath or chest pain.',
      physical_examination: 'Alert and oriented. Temp: 99.8°F, BP: 125/80, HR: 88. Lungs: mild bilateral wheezing.',
      diagnosis: 'Upper respiratory tract infection',
      treatment_plan: 'Antipyretics, cough suppressant, hydration. Follow-up in 3 days if symptoms persist.',
      status: 'ACTIVE',
      assigned_doctors: ['1'],
      assigned_doctor_names: ['Dr. Chinedu Okafor'],
      assigned_nurses: ['3'],
      assigned_nurse_names: ['Nurse Kemi Ogunleye'],
      created_by: '1',
      created_at: '2025-12-03T09:30:00Z',
      updated_at: '2025-12-03T09:30:00Z',
      vital_signs: [
        {
          id: 'v1',
          visit: '1',
          temperature_celsius: 37.7,
          systolic_bp: 125,
          diastolic_bp: 80,
          heart_rate: 88,
          respiratory_rate: 18,
          oxygen_saturation: 98,
          weight_kg: 65,
          height_cm: 165,
          bmi: 23.9,
          recorded_by: '1',
          recorded_by_name: 'Nurse Kemi Ogunleye',
          recorded_at: '2025-12-03T09:45:00Z',
        },
      ],
      lab_orders: [
        {
          id: 'l1',
          order_number: 'LO-2025-000145',
          visit: '1',
          test_name: 'Complete Blood Count (CBC)',
          test_category: 'Hematology',
          clinical_notes: 'R/O bacterial infection',
          status: 'COMPLETED',
          priority: 'ROUTINE',
          ordered_by: '1',
          ordered_by_name: 'Dr. Chinedu Okafor',
          technician_name: 'Emeka Eze',
          ordered_at: '2025-12-03T10:00:00Z',
          completed_at: '2025-12-03T14:30:00Z',
          results: [
            {
              id: 'r1',
              parameter_name: 'WBC Count',
              result_value: '11.2',
              unit: '10^9/L',
              reference_range: '4.0-11.0',
              is_abnormal: true,
              created_at: '2025-12-03T14:30:00Z',
            },
            {
              id: 'r2',
              parameter_name: 'Hemoglobin',
              result_value: '13.5',
              unit: 'g/dL',
              reference_range: '12.0-16.0',
              is_abnormal: false,
              created_at: '2025-12-03T14:30:00Z',
            },
            {
              id: 'r3',
              parameter_name: 'Platelet Count',
              result_value: '245',
              unit: '10^9/L',
              reference_range: '150-400',
              is_abnormal: false,
              created_at: '2025-12-03T14:30:00Z',
            },
          ],
        },
      ],
      medication_orders: [
        {
          id: 'm1',
          order_number: 'MO-2025-000178',
          visit: '1',
          medication_name: 'Azithromycin',
          dosage: '500mg',
          route: 'ORAL',
          frequency: 'OD',
          duration_days: 5,
          instructions: 'Take with food. Complete the full course.',
          status: 'ACTIVE',
          prescribed_by: '1',
          prescribed_by_name: 'Dr. Chinedu Okafor',
          prescribed_at: '2025-12-03T10:15:00Z',
        },
        {
          id: 'm2',
          order_number: 'MO-2025-000179',
          visit: '1',
          medication_name: 'Paracetamol',
          dosage: '650mg',
          route: 'ORAL',
          frequency: 'TID',
          duration_days: 5,
          instructions: 'Take as needed for fever.',
          status: 'ACTIVE',
          prescribed_by: '1',
          prescribed_by_name: 'Dr. Chinedu Okafor',
          prescribed_at: '2025-12-03T10:15:00Z',
        },
      ],
    },
    {
      id: '2',
      visit_number: 'VS-2025-000202',
      patient: '2',
      patient_details: {
        id: '2',
        mrn: 'MR-2025-000124',
        first_name: 'Tunde',
        last_name: 'Adeyemi',
        age: 52,
        gender: 'M',
        phone: '+234 (803) 234-5678',
        created_at: '2025-02-10T14:20:00Z',
      },
      visit_type: 'IPD',
      admission_datetime: '2025-12-01T16:00:00Z',
      duration_days: 2,
      chief_complaint: 'Chest pain and shortness of breath',
      history_of_present_illness: 'Sudden onset chest pain while exercising, radiating to left arm.',
      physical_examination: 'Appears uncomfortable. BP: 145/95, HR: 102, irregular rhythm.',
      diagnosis: 'Acute Coronary Syndrome - under evaluation',
      treatment_plan: 'ECG, Cardiac enzymes, Cardiology consult. NPO. IV access.',
      bed_number: '201',
      ward: 'Cardiac Care Unit',
      status: 'ACTIVE',
      assigned_doctors: ['1', '2'],
      assigned_doctor_names: ['Dr. John Smith', 'Dr. Sarah Wilson'],
      assigned_nurses: ['3'],
      assigned_nurse_names: ['Nurse Jane Doe'],
      created_by: '1',
      created_at: '2025-12-01T16:00:00Z',
      updated_at: '2025-12-03T08:00:00Z',
      vital_signs: [
        {
          id: 'v2',
          visit: '2',
          temperature_celsius: 37.2,
          systolic_bp: 145,
          diastolic_bp: 95,
          heart_rate: 102,
          respiratory_rate: 22,
          oxygen_saturation: 94,
          weight_kg: 82,
          height_cm: 175,
          bmi: 26.8,
          notes: 'Patient on oxygen 2L/min via nasal cannula',
          recorded_by: '1',
          recorded_by_name: 'Nurse Jane Doe',
          recorded_at: '2025-12-01T16:30:00Z',
        },
      ],
      lab_orders: [
        {
          id: 'l2',
          order_number: 'LO-2025-000146',
          visit: '2',
          test_name: 'Cardiac Troponin I',
          test_category: 'Cardiology',
          clinical_notes: 'R/O acute MI',
          status: 'PENDING',
          priority: 'STAT',
          ordered_by: '1',
          ordered_by_name: 'Dr. John Smith',
          ordered_at: '2025-12-01T16:15:00Z',
        },
        {
          id: 'l3',
          order_number: 'LO-2025-000147',
          visit: '2',
          test_name: 'Lipid Profile',
          test_category: 'Biochemistry',
          clinical_notes: 'Assess cardiovascular risk',
          status: 'PENDING',
          priority: 'ROUTINE',
          ordered_by: '1',
          ordered_by_name: 'Dr. John Smith',
          ordered_at: '2025-12-01T16:15:00Z',
        },
      ],
      medication_orders: [
        {
          id: 'm3',
          order_number: 'MO-2025-000180',
          visit: '2',
          medication_name: 'Aspirin',
          dosage: '75mg',
          route: 'ORAL',
          frequency: 'OD',
          duration_days: 30,
          instructions: 'Take after meals to prevent bleeding.',
          status: 'ACTIVE',
          prescribed_by: '1',
          prescribed_by_name: 'Dr. John Smith',
          prescribed_at: '2025-12-01T16:20:00Z',
        },
        {
          id: 'm4',
          order_number: 'MO-2025-000181',
          visit: '2',
          medication_name: 'Atorvastatin',
          dosage: '20mg',
          route: 'ORAL',
          frequency: 'OD',
          duration_days: 30,
          instructions: 'Take at bedtime.',
          status: 'ACTIVE',
          prescribed_by: '1',
          prescribed_by_name: 'Dr. John Smith',
          prescribed_at: '2025-12-01T16:20:00Z',
        },
      ],
      radiology_orders: [
        {
          id: 'r1',
          order_number: 'RO-2025-000050',
          visit: '2',
          study_type: 'X-Ray',
          body_part: 'Chest',
          clinical_indication: 'R/O pulmonary edema, cardiac enlargement',
          priority: 'URGENT',
          status: 'PENDING',
          ordered_by: '1',
          ordered_by_name: 'Dr. John Smith',
          ordered_at: '2025-12-01T16:10:00Z',
        },
      ],
    },
  ];

  const mockBill: Bill = {
    id: '1',
    bill_number: 'BL-2025-000089',
    visit: '1',
    visit_number: 'VS-2025-000201',
    patient: '1',
    patient_name: 'Sarah Johnson',
    consultation_fee: 500,
    lab_charges: 850,
    radiology_charges: 0,
    medication_charges: 320,
    bed_charges: 0,
    procedure_charges: 0,
    other_charges: 100,
    subtotal: 1770,
    tax_amount: 177,
    discount_amount: 0,
    total_amount: 1947,
    paid_amount: 1000,
    balance_amount: 947,
    payment_status: 'PARTIAL',
    payment_method: 'CARD',
    notes: 'Partial payment received via credit card',
    created_by: '1',
    created_by_name: 'Jane Williams',
    created_at: '2025-12-03T15:00:00Z',
    updated_at: '2025-12-03T15:00:00Z',
  };

  const mockDoctors: User[] = [
    {
      id: '1',
      username: 'dr_okafor',
      email: 'okafor@mediflow.com',
      first_name: 'Chinedu',
      last_name: 'Okafor',
      full_name: 'Dr. Chinedu Okafor',
      role: 'DOCTOR',
      license_number: 'MD-12345',
      specialization: 'General Medicine',
      is_active: true,
    },
    {
      id: '2',
      username: 'dr_adeyemi',
      email: 'adeyemi@mediflow.com',
      first_name: 'Folake',
      last_name: 'Adeyemi',
      full_name: 'Dr. Folake Adeyemi',
      role: 'DOCTOR',
      license_number: 'MD-12346',
      specialization: 'Cardiology',
      is_active: true,
    },
    {
      id: '3',
      username: 'dr_nwosu',
      email: 'nwosu@mediflow.com',
      first_name: 'Uchenna',
      last_name: 'Nwosu',
      full_name: 'Dr. Uchenna Nwosu',
      role: 'DOCTOR',
      license_number: 'MD-12347',
      specialization: 'Pediatrics',
      is_active: true,
    },
  ];

  const mockAppointments: Appointment[] = [
    {
      id: '1',
      appointment_number: 'AP-2025-000301',
      patient: '1',
      patient_details: {
        id: '1',
        mrn: 'MR-2025-000123',
        first_name: 'Aisha',
        last_name: 'Bello',
        age: 39,
        gender: 'F',
        phone: '+234 (802) 123-4567',
        created_at: '2025-01-15T10:30:00Z',
      },
      doctor: '1',
      doctor_name: 'Dr. Chinedu Okafor',
      doctor_specialization: 'General Medicine',
      appointment_date: '2025-12-03',
      appointment_time: '10:00',
      duration_minutes: 30,
      appointment_type: 'FOLLOW_UP',
      reason: 'Follow-up for respiratory infection treatment',
      notes: 'Patient requested morning slot',
      status: 'SCHEDULED',
      created_by: '1',
      created_by_name: 'Receptionist Adaeze',
      created_at: '2025-12-01T14:00:00Z',
      updated_at: '2025-12-01T14:00:00Z',
    },
    {
      id: '2',
      appointment_number: 'AP-2025-000302',
      patient: '2',
      patient_details: {
        id: '2',
        mrn: 'MR-2025-000124',
        first_name: 'Tunde',
        last_name: 'Adeyemi',
        age: 52,
        gender: 'M',
        phone: '+234 (803) 234-5678',
        created_at: '2025-02-10T14:20:00Z',
      },
      doctor: '2',
      doctor_name: 'Dr. Folake Adeyemi',
      doctor_specialization: 'Cardiology',
      appointment_date: '2025-12-04',
      appointment_time: '14:30',
      duration_minutes: 45,
      appointment_type: 'NEW_CONSULTATION',
      reason: 'Chest pain evaluation and cardiac assessment',
      notes: 'Urgent - patient experiencing symptoms',
      status: 'CONFIRMED',
      created_by: '1',
      created_by_name: 'Receptionist Adaeze',
      created_at: '2025-12-02T09:00:00Z',
      updated_at: '2025-12-02T10:00:00Z',
    },
    {
      id: '3',
      appointment_number: 'AP-2025-000303',
      patient: '3',
      patient_details: {
        id: '3',
        mrn: 'MR-2025-000125',
        first_name: 'Ifeoma',
        last_name: 'Nwosu',
        age: 34,
        gender: 'F',
        phone: '+234 (805) 345-6789',
        created_at: '2025-11-25T09:15:00Z',
      },
      doctor: '3',
      doctor_name: 'Dr. Uchenna Nwosu',
      doctor_specialization: 'Pediatrics',
      appointment_date: '2025-12-05',
      appointment_time: '09:00',
      duration_minutes: 30,
      appointment_type: 'CHECK_UP',
      reason: 'Annual health check-up',
      status: 'SCHEDULED',
      created_by: '1',
      created_by_name: 'Receptionist Adaeze',
      created_at: '2025-11-28T11:00:00Z',
      updated_at: '2025-11-28T11:00:00Z',
    },
  ];

  // Initialize mock data on mount
  useEffect(() => {
    if (patients.length === 0) {
      setPatients(mockPatients);
    }
    if (visits.length === 0) {
      setVisits(mockVisits);
    }
    if (appointments.length === 0) {
      setAppointments(mockAppointments);
    }
  }, []);

  const handleLogout = () => {
    alert('Logout functionality would be implemented here');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedPatient(null);
    setSelectedVisit(null);
  };

  const handlePatientSubmit = (patientData: any) => {
    const newPatient: Patient = {
      ...patientData,
      id: (patients.length + 1).toString(),
      created_by_name: currentUser.full_name,
    };
    setPatients([newPatient, ...patients]);
    setShowPatientForm(false);
    toast.success('Patient registered successfully!');
  };

  const handleVisitSubmit = (visitData: any) => {
    setVisits([visitData, ...visits]);
    setShowVisitForm(false);
    toast.success('Visit created successfully!');
  };

  const handleVitalsSubmit = (vitalsData: any) => {
    if (vitalsVisitContext) {
      // Add vitals to the specific visit
      setVisits(prevVisits => 
        prevVisits.map(visit => {
          if (visit.id === vitalsVisitContext) {
            const newVital: VitalSign = {
              ...vitalsData,
              id: `v${Date.now()}`,
              visit: visit.id,
              recorded_by: currentUser.id,
              recorded_by_name: currentUser.full_name,
              recorded_at: new Date().toISOString(),
            };
            return {
              ...visit,
              vital_signs: [...(visit.vital_signs || []), newVital],
            };
          }
          return visit;
        })
      );
      
      // Update selectedVisit if it's the current one
      if (selectedVisit && selectedVisit.id === vitalsVisitContext) {
        const newVital: VitalSign = {
          ...vitalsData,
          id: `v${Date.now()}`,
          visit: vitalsVisitContext,
          recorded_by: currentUser.id,
          recorded_by_name: currentUser.full_name,
          recorded_at: new Date().toISOString(),
        };
        setSelectedVisit({
          ...selectedVisit,
          vital_signs: [...(selectedVisit.vital_signs || []), newVital],
        });
      }
    }
    setShowVitalsForm(false);
    setVitalsVisitContext(null);
    toast.success('Vitals recorded successfully!');
  };

  const handleRecordVitals = (visitId: string) => {
    setVitalsVisitContext(visitId);
    setShowVitalsForm(true);
  };

  const handleLabOrderCreated = (order: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === order.visit
          ? {
              ...visit,
              lab_orders: [...(visit.lab_orders || []), { ...order, ordered_by_name: currentUser.full_name }],
            }
          : visit
      )
    );
    
    if (selectedVisit && selectedVisit.id === order.visit) {
      setSelectedVisit({
        ...selectedVisit,
        lab_orders: [...(selectedVisit.lab_orders || []), { ...order, ordered_by_name: currentUser.full_name }],
      });
    }
    toast.success('Lab order created successfully!');
  };

  const handleMedicationOrdersCreated = (medications: any[]) => {
    const visitId = medications[0]?.visit;
    if (!visitId) return;

    const medicationsWithDoctor = medications.map(med => ({
      ...med,
      prescribed_by_name: currentUser.full_name,
    }));

    setVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === visitId
          ? {
              ...visit,
              medication_orders: [...(visit.medication_orders || []), ...medicationsWithDoctor],
            }
          : visit
      )
    );
    
    if (selectedVisit && selectedVisit.id === visitId) {
      setSelectedVisit({
        ...selectedVisit,
        medication_orders: [...(selectedVisit.medication_orders || []), ...medicationsWithDoctor],
      });
    }
    toast.success(`${medications.length} medication(s) prescribed successfully!`);
  };

  const handleRadiologyOrderCreated = (order: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === order.visit
          ? {
              ...visit,
              radiology_orders: [...(visit.radiology_orders || []), { ...order, ordered_by_name: currentUser.full_name }],
            }
          : visit
      )
    );
    
    if (selectedVisit && selectedVisit.id === order.visit) {
      setSelectedVisit({
        ...selectedVisit,
        radiology_orders: [...(selectedVisit.radiology_orders || []), { ...order, ordered_by_name: currentUser.full_name }],
      });
    }
    toast.success('Radiology order created successfully!');
  };

  const handleDischargeSummaryCreated = (summary: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit =>
        visit.id === summary.visit
          ? {
              ...visit,
              status: 'DISCHARGED' as const,
              discharge_datetime: summary.discharge_date,
              discharge_summary: { ...summary, prepared_by_name: currentUser.full_name },
            }
          : visit
      )
    );
    
    if (selectedVisit && selectedVisit.id === summary.visit) {
      setSelectedVisit({
        ...selectedVisit,
        status: 'DISCHARGED' as const,
        discharge_datetime: summary.discharge_date,
        discharge_summary: { ...summary, prepared_by_name: currentUser.full_name },
      });
    }
    toast.success('Patient discharged successfully!');
    setSelectedVisit(null);
  };

  const handleLabOrderUpdated = (orderId: string, updates: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit => ({
        ...visit,
        lab_orders: visit.lab_orders?.map(order =>
          order.id === orderId ? { ...order, ...updates, completed_at: new Date().toISOString() } : order
        ),
      }))
    );
    toast.success('Lab results recorded successfully!');
  };

  const handleMedicationUpdated = (orderId: string, updates: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit => ({
        ...visit,
        medication_orders: visit.medication_orders?.map(order =>
          order.id === orderId ? { ...order, ...updates } : order
        ),
      }))
    );
    toast.success('Medication dispensed successfully!');
  };

  const handleRadiologyOrderUpdated = (orderId: string, updates: any) => {
    setVisits(prevVisits =>
      prevVisits.map(visit => ({
        ...visit,
        radiology_orders: visit.radiology_orders?.map(order =>
          order.id === orderId ? { ...order, ...updates, completed_at: new Date().toISOString() } : order
        ),
      }))
    );
    toast.success('Radiology report completed successfully!');
  };

  const handleCreateAppointment = (appointmentData: Partial<Appointment>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: (appointments.length + 1).toString(),
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
    } as Appointment;
    setAppointments([newAppointment, ...appointments]);
    toast.success('Appointment booked successfully!');
  };

  const handleAppointmentCheckIn = (appointmentId: string) => {
    setAppointments(prevAppointments =>
      prevAppointments.map(appointment =>
        appointment.id === appointmentId
          ? { ...appointment, status: 'CHECKED_IN' as const, updated_at: new Date().toISOString() }
          : appointment
      )
    );
    toast.success('Patient checked in successfully!');
  };

  const handleAppointmentCancel = (appointmentId: string) => {
    const reason = prompt('Please enter reason for cancellation:');
    if (reason) {
      setAppointments(prevAppointments =>
        prevAppointments.map(appointment =>
          appointment.id === appointmentId
            ? {
                ...appointment,
                status: 'CANCELLED' as const,
                cancelled_at: new Date().toISOString(),
                cancellation_reason: reason,
                updated_at: new Date().toISOString(),
              }
            : appointment
        )
      );
      toast.success('Appointment cancelled successfully!');
    }
  };

  const handleCreateVisitFromAppointment = (appointmentId: string) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if (!appointment) return;

    const patient = patients.find(p => p.id === appointment.patient);
    if (!patient) return;

    const visit_number = `VS-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    
    const newVisit: Visit = {
      id: (visits.length + 1).toString(),
      visit_number,
      patient: appointment.patient,
      patient_details: appointment.patient_details,
      visit_type: 'OPD',
      admission_datetime: new Date().toISOString(),
      duration_days: 0,
      chief_complaint: appointment.reason,
      history_of_present_illness: '',
      physical_examination: '',
      diagnosis: '',
      treatment_plan: '',
      status: 'ACTIVE',
      assigned_doctors: [appointment.doctor],
      assigned_doctor_names: [appointment.doctor_name || ''],
      assigned_nurses: [],
      assigned_nurse_names: [],
      created_by: currentUser.id,
      created_by_name: currentUser.full_name,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setVisits([newVisit, ...visits]);

    setAppointments(prevAppointments =>
      prevAppointments.map(appt =>
        appt.id === appointmentId
          ? {
              ...appt,
              status: 'IN_PROGRESS' as const,
              visit_created: newVisit.id,
              visit_number,
              updated_at: new Date().toISOString(),
            }
          : appt
      )
    );

    toast.success('Visit created from appointment!');
    setSelectedVisit(newVisit);
  };

  const renderContent = () => {
    if (selectedPatient) {
      const patientVisits = visits.filter(v => v.patient === selectedPatient.id);
      return (
        <PatientDetail
          patient={selectedPatient}
          visits={patientVisits}
          onBack={() => setSelectedPatient(null)}
          onCreateVisit={(patient) => {
            setShowVisitForm(true);
          }}
        />
      );
    }

    if (selectedVisit) {
      // Find the patient associated with this visit
      const visitPatient = patients.find(p => p.id === selectedVisit.patient);
      
      return (
        <VisitDetail
          visit={selectedVisit}
          patient={visitPatient}
          onBack={() => setSelectedVisit(null)}
          onRecordVitals={() => handleRecordVitals(selectedVisit.id)}
          onLabOrderCreated={handleLabOrderCreated}
          onMedicationOrdersCreated={handleMedicationOrdersCreated}
          onRadiologyOrderCreated={handleRadiologyOrderCreated}
          onDischargeSummaryCreated={handleDischargeSummaryCreated}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return (
          <Dashboard 
            userRole={currentUser.role}
            patients={patients}
            visits={visits}
            onPatientClick={setSelectedPatient}
            onVisitClick={setSelectedVisit}
            onRegisterPatient={() => setShowPatientForm(true)}
            onCreateVisit={() => setShowVisitForm(true)}
            onRecordVitals={() => setShowVitalsForm(true)}
          />
        );

      case 'patients': {
        const filteredPatients = patients.filter(patient => {
          const searchLower = patientSearchTerm.toLowerCase();
          return (
            patient.mrn.toLowerCase().includes(searchLower) ||
            patient.first_name.toLowerCase().includes(searchLower) ||
            patient.last_name.toLowerCase().includes(searchLower) ||
            `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchLower) ||
            patient.phone.includes(searchLower) ||
            (patient.email && patient.email.toLowerCase().includes(searchLower))
          );
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-gray-900">Patients</h2>
                <p className="text-gray-600">
                  {patients.length} {patients.length === 1 ? 'patient' : 'patients'} registered
                </p>
              </div>
              <button 
                onClick={() => setShowPatientForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Register Patient
              </button>
            </div>

            <SearchFilter
              placeholder="Search by MRN, name, phone, or email..."
              onSearch={setPatientSearchTerm}
            />

            <div className="space-y-4">
              {filteredPatients.length > 0 ? (
                filteredPatients.map(patient => (
                  <PatientCard
                    key={patient.id}
                    patient={patient}
                    onClick={() => setSelectedPatient(patient)}
                  />
                ))
              ) : patients.length === 0 ? (
                <Card>
                  <CardBody>
                    <div className="text-center py-8 text-gray-500">
                      No patients registered yet. Click "Register Patient" to add a new patient.
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <div className="text-center py-8 text-gray-500">
                      No patients found matching your search.
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        );
      }

      case 'visits': {
        // Filter visits based on selected filter
        let filteredVisits = visits;
        
        // Apply status filter
        if (visitFilter === 'ACTIVE') {
          filteredVisits = filteredVisits.filter(v => v.status === 'ACTIVE');
        } else if (visitFilter === 'DISCHARGED') {
          filteredVisits = filteredVisits.filter(v => v.status === 'DISCHARGED');
        } else if (visitFilter === 'TODAY') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          filteredVisits = filteredVisits.filter(v => {
            const visitDate = new Date(v.admission_datetime);
            visitDate.setHours(0, 0, 0, 0);
            return visitDate.getTime() === today.getTime();
          });
        }
        
        // Apply search filter
        if (visitSearchTerm) {
          const searchLower = visitSearchTerm.toLowerCase();
          filteredVisits = filteredVisits.filter(visit => {
            const patientDetails = visit.patient_details;
            return (
              visit.visit_number.toLowerCase().includes(searchLower) ||
              (patientDetails && (
                patientDetails.mrn.toLowerCase().includes(searchLower) ||
                patientDetails.first_name.toLowerCase().includes(searchLower) ||
                patientDetails.last_name.toLowerCase().includes(searchLower) ||
                `${patientDetails.first_name} ${patientDetails.last_name}`.toLowerCase().includes(searchLower)
              )) ||
              visit.chief_complaint.toLowerCase().includes(searchLower) ||
              (visit.diagnosis && visit.diagnosis.toLowerCase().includes(searchLower))
            );
          });
        }

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-gray-900">Visits</h2>
                <p className="text-gray-600">
                  {visits.length} total visits • {visits.filter(v => v.status === 'ACTIVE').length} active
                </p>
              </div>
              <button 
                onClick={() => setShowVisitForm(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Plus size={20} />
                Create Visit
              </button>
            </div>

            <SearchFilter
              placeholder="Search by visit number, patient name, MRN, or diagnosis..."
              onSearch={setVisitSearchTerm}
            />

            <div className="flex gap-2 flex-wrap">
              <button 
                onClick={() => setVisitFilter('ALL')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  visitFilter === 'ALL' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All Visits
              </button>
              <button 
                onClick={() => setVisitFilter('TODAY')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  visitFilter === 'TODAY' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Today's Visits
              </button>
              <button 
                onClick={() => setVisitFilter('ACTIVE')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  visitFilter === 'ACTIVE' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setVisitFilter('DISCHARGED')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  visitFilter === 'DISCHARGED' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Discharged
              </button>
            </div>

            <div className="space-y-4">
              {filteredVisits.length > 0 ? (
                filteredVisits.map(visit => (
                  <VisitCard
                    key={visit.id}
                    visit={visit}
                    onClick={() => setSelectedVisit(visit)}
                  />
                ))
              ) : visits.length === 0 ? (
                <Card>
                  <CardBody>
                    <div className="text-center py-8 text-gray-500">
                      No visits recorded yet. Click "Create Visit" to start a new visit.
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <Card>
                  <CardBody>
                    <div className="text-center py-8 text-gray-500">
                      No visits found matching your filters.
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        );
      }

      case 'appointments':
        return (
          <Appointments
            userRole={currentUser.role}
            appointments={appointments}
            patients={patients}
            doctors={mockDoctors}
            onCreateAppointment={handleCreateAppointment}
            onCheckIn={handleAppointmentCheckIn}
            onCancel={handleAppointmentCancel}
            onCreateVisit={handleCreateVisitFromAppointment}
          />
        );

      case 'orders':
        return (
          <OrdersManagement
            visits={visits}
            currentUser={currentUser}
            onLabOrderUpdated={handleLabOrderUpdated}
            onMedicationUpdated={handleMedicationUpdated}
            onRadiologyOrderUpdated={handleRadiologyOrderUpdated}
          />
        );

      case 'vitals':
        return (
          <VitalsTracking
            visits={visits}
            onVitalsRecorded={(visitId, vitalsData) => {
              handleRecordVitals(visitId);
              handleVitalsSubmit(vitalsData);
            }}
          />
        );

      case 'reports':
        return (
          <Reports
            visits={visits}
            patients={patients}
            currentUser={currentUser}
          />
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-gray-900">Billing</h2>
              <p className="text-gray-600">Manage patient bills and payments</p>
            </div>

            <div className="max-w-3xl mx-auto">
              <BillSummary bill={mockBill} />
            </div>
          </div>
        );

      case 'settings':
        return <Settings currentUser={currentUser} />;

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-gray-900 mb-2">{currentPage}</h3>
              <p className="text-gray-600">This page is under development</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Forms */}
      {showPatientForm && (
        <PatientRegistrationForm
          onClose={() => setShowPatientForm(false)}
          onSubmit={handlePatientSubmit}
        />
      )}
      
      {showVisitForm && (
        <VisitCreationForm
          patients={patients}
          onClose={() => setShowVisitForm(false)}
          onSubmit={handleVisitSubmit}
        />
      )}
      
      {showVitalsForm && (
        <VitalsRecordingForm
          onClose={() => {
            setShowVitalsForm(false);
            setVitalsVisitContext(null);
          }}
          onSubmit={handleVitalsSubmit}
        />
      )}
      
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        userRole={currentUser.role}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={currentUser} 
          onLogout={handleLogout}
          onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}