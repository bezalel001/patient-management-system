/**
 * Enhanced demo data for AI features
 * This provides rich patient data to showcase AI chat and summary capabilities
 */

import { Patient, Visit } from '../types';

export const aiDemoPatient: Patient = {
  id: 'ai-demo-1',
  mrn: 'MR-2025-999999',
  first_name: 'Robert',
  last_name: 'Thompson',
  date_of_birth: '1965-08-22',
  age: 59,
  gender: 'M',
  blood_group: 'A+',
  phone: '+1 (555) 789-0123',
  email: 'robert.thompson@email.com',
  address: '789 Medical Center Drive, Apt 12C',
  city: 'Boston',
  state: 'MA',
  postal_code: '02115',
  allergies: 'Penicillin (anaphylaxis), Sulfa drugs (severe rash), Shellfish (hives)',
  medical_history: `Type 2 Diabetes Mellitus - diagnosed 2015, managed with oral medications
Hypertension - diagnosed 2012, well-controlled
Coronary Artery Disease - MI in 2020, PCI with 2 stents placed
Chronic Kidney Disease Stage 3a - stable
Benign Prostatic Hyperplasia - managed medically
Osteoarthritis - bilateral knees
Former smoker (quit 2020) - 30 pack-year history
Family History: Father - MI at age 62, Mother - Type 2 DM`,
  current_medications: `1. Metformin 1000mg - Oral - Twice daily with meals
2. Glimepiride 2mg - Oral - Once daily before breakfast
3. Lisinopril 20mg - Oral - Once daily
4. Atorvastatin 40mg - Oral - Once daily at bedtime
5. Aspirin 81mg - Oral - Once daily
6. Clopidogrel 75mg - Oral - Once daily
7. Tamsulosin 0.4mg - Oral - Once daily at bedtime
8. Vitamin D3 2000 IU - Oral - Once daily`,
  insurance_provider: 'Medicare + Blue Cross Supplemental',
  insurance_number: 'MCR-123456789A',
  emergency_contacts: [
    {
      id: 'ec1',
      name: 'Margaret Thompson',
      relationship: 'Spouse',
      phone: '+1 (555) 789-0124',
      alternate_phone: '+1 (555) 789-0125',
    },
    {
      id: 'ec2',
      name: 'David Thompson',
      relationship: 'Son',
      phone: '+1 (555) 456-7890',
    },
  ],
  is_active: true,
  created_by: '1',
  created_by_name: 'Dr. Sarah Williams',
  created_at: '2020-03-15T10:00:00Z',
  updated_at: '2025-12-01T14:30:00Z',
};

export const aiDemoVisits: Visit[] = [
  {
    id: 'ai-visit-1',
    visit_number: 'VS-2025-100001',
    patient: 'ai-demo-1',
    patient_details: {
      id: 'ai-demo-1',
      mrn: 'MR-2025-999999',
      first_name: 'Robert',
      last_name: 'Thompson',
      age: 59,
      gender: 'M',
      phone: '+1 (555) 789-0123',
      created_at: '2020-03-15T10:00:00Z',
    },
    visit_type: 'IPD',
    admission_datetime: '2025-12-01T08:30:00Z',
    duration_days: 2,
    chief_complaint: 'Chest pain radiating to left arm, shortness of breath',
    history_of_present_illness: `Patient presented to ER at 0830 with sudden onset chest pain that started while climbing stairs at home. Pain described as "pressure-like", 7/10 intensity, radiating to left arm and jaw. Associated with diaphoresis, nausea, and mild shortness of breath. Pain not relieved by rest. Given patient's history of CAD with previous MI and stent placement, brought in by EMS.

No recent changes to medications. Has been compliant with cardiac medications. Last cardiology follow-up 3 months ago showed stable condition.`,
    physical_examination: `General: Alert, anxious, in moderate distress
Vitals: BP 155/92, HR 98 (regular), RR 22, SpO2 94% on room air, Temp 37.2°C
Cardiovascular: S1 S2 normal, no murmurs, JVP not elevated, peripheral pulses intact
Respiratory: Bilateral air entry, mild bibasilar crackles, no wheezing
Abdomen: Soft, non-tender, bowel sounds present
Extremities: No pedal edema, capillary refill <2 seconds`,
    diagnosis: `Acute Coronary Syndrome - NSTEMI (Non-ST Elevation Myocardial Infarction)
Secondary diagnoses:
- Type 2 Diabetes Mellitus
- Hypertension
- Chronic Kidney Disease Stage 3a`,
    treatment_plan: `1. Admitted to CCU for continuous cardiac monitoring
2. Cardiology consultation - Dr. Michael Chen
3. Serial troponin levels, ECG monitoring
4. Continue dual antiplatelet therapy (Aspirin + Clopidogrel)
5. Started on IV heparin drip
6. Beta blocker initiated (Metoprolol)
7. Continue statin therapy
8. Nitrate therapy PRN for chest pain
9. Cardiac catheterization scheduled for tomorrow morning
10. NPO after midnight for procedure
11. Diabetes management - insulin sliding scale while NPO`,
    bed_number: 'CCU-204',
    ward: 'Cardiac Care Unit',
    status: 'ACTIVE',
    assigned_doctors: ['doc-1'],
    assigned_doctors_details: [
      {
        id: 'doc-1',
        username: 'dr_williams',
        email: 'sarah.williams@hospital.com',
        first_name: 'Sarah',
        last_name: 'Williams',
        full_name: 'Dr. Sarah Williams',
        role: 'DOCTOR',
        specialization: 'Cardiology',
        license_number: 'MD-87654',
        is_active: true,
      },
    ],
    assigned_nurses: ['nurse-1', 'nurse-2'],
    assigned_nurses_details: [
      {
        id: 'nurse-1',
        username: 'nurse_johnson',
        email: 'mary.johnson@hospital.com',
        first_name: 'Mary',
        last_name: 'Johnson',
        full_name: 'Mary Johnson, RN',
        role: 'NURSE',
        is_active: true,
      },
      {
        id: 'nurse-2',
        username: 'nurse_patel',
        email: 'raj.patel@hospital.com',
        first_name: 'Raj',
        last_name: 'Patel',
        full_name: 'Raj Patel, RN',
        role: 'NURSE',
        is_active: true,
      },
    ],
    vital_signs: [
      {
        id: 'v1',
        visit: 'ai-visit-1',
        temperature_celsius: 37.2,
        systolic_bp: 155,
        diastolic_bp: 92,
        heart_rate: 98,
        respiratory_rate: 22,
        oxygen_saturation: 94,
        weight_kg: 89.5,
        height_cm: 175,
        bmi: 29.2,
        notes: 'Patient in moderate distress, anxious',
        recorded_by: 'nurse-1',
        recorded_by_name: 'Mary Johnson, RN',
        recorded_at: '2025-12-01T08:45:00Z',
      },
      {
        id: 'v2',
        visit: 'ai-visit-1',
        temperature_celsius: 37.0,
        systolic_bp: 142,
        diastolic_bp: 86,
        heart_rate: 82,
        respiratory_rate: 18,
        oxygen_saturation: 96,
        notes: 'Improved after nitroglycerin, chest pain reduced to 3/10',
        recorded_by: 'nurse-1',
        recorded_by_name: 'Mary Johnson, RN',
        recorded_at: '2025-12-01T12:30:00Z',
      },
      {
        id: 'v3',
        visit: 'ai-visit-1',
        temperature_celsius: 36.9,
        systolic_bp: 138,
        diastolic_bp: 82,
        heart_rate: 78,
        respiratory_rate: 16,
        oxygen_saturation: 98,
        notes: 'Stable, no chest pain. Preparing for cath lab tomorrow.',
        recorded_by: 'nurse-2',
        recorded_by_name: 'Raj Patel, RN',
        recorded_at: '2025-12-01T20:00:00Z',
      },
    ],
    lab_orders: [
      {
        id: 'lab1',
        order_number: 'LO-2025-010234',
        visit: 'ai-visit-1',
        test_name: 'Troponin I (Serial)',
        test_category: 'Cardiac Markers',
        clinical_notes: 'R/O acute MI - baseline and serial q6h',
        status: 'COMPLETED',
        priority: 'STAT',
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        technician: 'tech-1',
        technician_name: 'Lisa Chen',
        ordered_at: '2025-12-01T08:50:00Z',
        completed_at: '2025-12-01T09:15:00Z',
        results: [
          {
            id: 'r1',
            parameter_name: 'Troponin I - Baseline',
            result_value: '2.8',
            unit: 'ng/mL',
            reference_range: '<0.04',
            is_abnormal: true,
            notes: 'CRITICAL - Significantly elevated, consistent with myocardial injury',
            created_at: '2025-12-01T09:15:00Z',
          },
          {
            id: 'r2',
            parameter_name: 'Troponin I - 6 hours',
            result_value: '3.5',
            unit: 'ng/mL',
            reference_range: '<0.04',
            is_abnormal: true,
            notes: 'Rising trend - consistent with acute MI',
            created_at: '2025-12-01T15:20:00Z',
          },
        ],
      },
      {
        id: 'lab2',
        order_number: 'LO-2025-010235',
        visit: 'ai-visit-1',
        test_name: 'Complete Blood Count (CBC)',
        test_category: 'Hematology',
        status: 'COMPLETED',
        priority: 'STAT',
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        technician: 'tech-1',
        technician_name: 'Lisa Chen',
        ordered_at: '2025-12-01T08:50:00Z',
        completed_at: '2025-12-01T09:30:00Z',
        results: [
          {
            id: 'r3',
            parameter_name: 'Hemoglobin',
            result_value: '13.2',
            unit: 'g/dL',
            reference_range: '13.5-17.5',
            is_abnormal: false,
            created_at: '2025-12-01T09:30:00Z',
          },
          {
            id: 'r4',
            parameter_name: 'WBC Count',
            result_value: '9.8',
            unit: '10^9/L',
            reference_range: '4.0-11.0',
            is_abnormal: false,
            created_at: '2025-12-01T09:30:00Z',
          },
          {
            id: 'r5',
            parameter_name: 'Platelet Count',
            result_value: '245',
            unit: '10^9/L',
            reference_range: '150-400',
            is_abnormal: false,
            created_at: '2025-12-01T09:30:00Z',
          },
        ],
      },
      {
        id: 'lab3',
        order_number: 'LO-2025-010236',
        visit: 'ai-visit-1',
        test_name: 'Basic Metabolic Panel',
        test_category: 'Chemistry',
        clinical_notes: 'Check renal function before cath',
        status: 'COMPLETED',
        priority: 'STAT',
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        ordered_at: '2025-12-01T08:50:00Z',
        completed_at: '2025-12-01T09:45:00Z',
        results: [
          {
            id: 'r6',
            parameter_name: 'Creatinine',
            result_value: '1.4',
            unit: 'mg/dL',
            reference_range: '0.7-1.3',
            is_abnormal: true,
            notes: 'Mildly elevated - consistent with known CKD Stage 3a',
            created_at: '2025-12-01T09:45:00Z',
          },
          {
            id: 'r7',
            parameter_name: 'eGFR',
            result_value: '52',
            unit: 'mL/min/1.73m²',
            reference_range: '>60',
            is_abnormal: true,
            notes: 'Moderate reduction - CKD Stage 3a. Consider contrast dose adjustment.',
            created_at: '2025-12-01T09:45:00Z',
          },
          {
            id: 'r8',
            parameter_name: 'Potassium',
            result_value: '4.2',
            unit: 'mmol/L',
            reference_range: '3.5-5.0',
            is_abnormal: false,
            created_at: '2025-12-01T09:45:00Z',
          },
        ],
      },
      {
        id: 'lab4',
        order_number: 'LO-2025-010237',
        visit: 'ai-visit-1',
        test_name: 'HbA1c',
        test_category: 'Diabetes',
        clinical_notes: 'Assess diabetes control',
        status: 'COMPLETED',
        priority: 'ROUTINE',
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        ordered_at: '2025-12-01T08:50:00Z',
        completed_at: '2025-12-01T14:00:00Z',
        results: [
          {
            id: 'r9',
            parameter_name: 'Hemoglobin A1c',
            result_value: '7.8',
            unit: '%',
            reference_range: '<7.0',
            is_abnormal: true,
            notes: 'Above target - suboptimal diabetes control',
            created_at: '2025-12-01T14:00:00Z',
          },
        ],
      },
      {
        id: 'lab5',
        order_number: 'LO-2025-010238',
        visit: 'ai-visit-1',
        test_name: 'Lipid Panel',
        test_category: 'Chemistry',
        status: 'IN_PROGRESS',
        priority: 'ROUTINE',
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        ordered_at: '2025-12-01T08:50:00Z',
      },
    ],
    medication_orders: [
      {
        id: 'med1',
        order_number: 'MO-2025-020567',
        visit: 'ai-visit-1',
        medication_name: 'Aspirin',
        dosage: '325mg',
        route: 'ORAL',
        frequency: 'Once',
        duration_days: 1,
        instructions: 'STAT dose given in ER, then continue 81mg daily',
        status: 'COMPLETED',
        prescribed_by: 'doc-1',
        prescribed_by_name: 'Dr. Sarah Williams',
        prescribed_at: '2025-12-01T08:55:00Z',
        dispensed_by: 'pharm-1',
        dispensed_by_name: 'Robert Garcia, PharmD',
        dispensed_at: '2025-12-01T09:00:00Z',
      },
      {
        id: 'med2',
        order_number: 'MO-2025-020568',
        visit: 'ai-visit-1',
        medication_name: 'Heparin',
        dosage: '5000 units',
        route: 'IV',
        frequency: 'Continuous infusion',
        duration_days: 2,
        instructions: 'Weight-based dosing. Monitor aPTT q6h. Target aPTT 50-70 seconds.',
        status: 'ACTIVE',
        prescribed_by: 'doc-1',
        prescribed_by_name: 'Dr. Sarah Williams',
        prescribed_at: '2025-12-01T09:10:00Z',
        dispensed_by: 'pharm-1',
        dispensed_by_name: 'Robert Garcia, PharmD',
        dispensed_at: '2025-12-01T09:20:00Z',
      },
      {
        id: 'med3',
        order_number: 'MO-2025-020569',
        visit: 'ai-visit-1',
        medication_name: 'Metoprolol',
        dosage: '25mg',
        route: 'ORAL',
        frequency: 'Twice daily',
        duration_days: 2,
        instructions: 'Hold if HR <60 or SBP <100. Monitor BP and HR closely.',
        status: 'ACTIVE',
        prescribed_by: 'doc-1',
        prescribed_by_name: 'Dr. Sarah Williams',
        prescribed_at: '2025-12-01T09:15:00Z',
        dispensed_by: 'pharm-1',
        dispensed_by_name: 'Robert Garcia, PharmD',
        dispensed_at: '2025-12-01T09:25:00Z',
      },
      {
        id: 'med4',
        order_number: 'MO-2025-020570',
        visit: 'ai-visit-1',
        medication_name: 'Nitroglycerin',
        dosage: '0.4mg',
        route: 'ORAL',
        frequency: 'PRN',
        duration_days: 2,
        instructions: 'Sublingual. For chest pain. May repeat x2 at 5 min intervals. Call MD if pain persists.',
        status: 'ACTIVE',
        prescribed_by: 'doc-1',
        prescribed_by_name: 'Dr. Sarah Williams',
        prescribed_at: '2025-12-01T09:15:00Z',
        dispensed_by: 'pharm-1',
        dispensed_by_name: 'Robert Garcia, PharmD',
        dispensed_at: '2025-12-01T09:25:00Z',
      },
      {
        id: 'med5',
        order_number: 'MO-2025-020571',
        visit: 'ai-visit-1',
        medication_name: 'Insulin Regular (Novolin R)',
        dosage: 'Per sliding scale',
        route: 'SC',
        frequency: 'QID (AC + HS)',
        duration_days: 2,
        instructions: 'Sliding scale: BG 150-200: 2U, 201-250: 4U, 251-300: 6U, >300: 8U + call MD',
        status: 'ACTIVE',
        prescribed_by: 'doc-1',
        prescribed_by_name: 'Dr. Sarah Williams',
        prescribed_at: '2025-12-01T10:00:00Z',
        dispensed_by: 'pharm-1',
        dispensed_by_name: 'Robert Garcia, PharmD',
        dispensed_at: '2025-12-01T10:15:00Z',
      },
    ],
    radiology_orders: [
      {
        id: 'rad1',
        order_number: 'RO-2025-005432',
        visit: 'ai-visit-1',
        study_type: 'ECG (12-lead)',
        body_part: 'Chest',
        clinical_indication: 'Acute chest pain, r/o STEMI',
        status: 'COMPLETED',
        priority: 'STAT',
        report: `INTERPRETATION:
Rate: 98 bpm (sinus tachycardia)
Rhythm: Regular sinus rhythm
Axis: Normal axis

ST Segment Analysis:
- ST depression (1-2mm) in leads V4, V5, V6
- ST depression (1mm) in leads II, III, aVF
- No ST elevation noted
- T wave inversion in lateral leads

Comparison with previous ECG (3 months ago):
- New ST segment changes
- New T wave inversions

IMPRESSION:
ABNORMAL ECG consistent with ACUTE CORONARY SYNDROME (Non-STEMI pattern)
Recommend:
- Immediate cardiology consultation
- Serial troponins
- Consider urgent cardiac catheterization

Reported by: Dr. James Martinez, Cardiologist
Date: 2025-12-01 09:30:00`,
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        radiologist: 'rad-1',
        radiologist_name: 'Dr. James Martinez',
        ordered_at: '2025-12-01T08:50:00Z',
        completed_at: '2025-12-01T09:30:00Z',
      },
      {
        id: 'rad2',
        order_number: 'RO-2025-005433',
        visit: 'ai-visit-1',
        study_type: 'Chest X-Ray (PA & Lateral)',
        body_part: 'Chest',
        clinical_indication: 'SOB, r/o pulmonary edema',
        status: 'COMPLETED',
        priority: 'STAT',
        report: `TECHNIQUE: PA and lateral chest radiographs

FINDINGS:
Heart: Borderline cardiomegaly. Cardiothoracic ratio 0.52
Lungs: Mild interstitial prominence bilaterally. Small bilateral pleural effusions. No focal consolidation.
Mediastinum: Normal contour. No widening.
Bones: Degenerative changes in thoracic spine. No acute fractures.

IMPRESSION:
1. Borderline cardiomegaly with mild pulmonary vascular congestion
2. Small bilateral pleural effusions
3. No acute pulmonary infiltrate

Clinical correlation recommended. Consider CHF exacerbation in appropriate clinical context.

Reported by: Dr. Lisa Wong, Radiologist
Date: 2025-12-01 10:45:00`,
        ordered_by: 'doc-1',
        ordered_by_name: 'Dr. Sarah Williams',
        radiologist: 'rad-2',
        radiologist_name: 'Dr. Lisa Wong',
        ordered_at: '2025-12-01T09:00:00Z',
        completed_at: '2025-12-01T10:45:00Z',
      },
    ],
    created_by: 'doc-1',
    created_by_name: 'Dr. Sarah Williams',
    created_at: '2025-12-01T08:30:00Z',
    updated_at: '2025-12-01T20:30:00Z',
  },
  {
    id: 'ai-visit-2',
    visit_number: 'VS-2025-088234',
    patient: 'ai-demo-1',
    visit_type: 'OPD',
    admission_datetime: '2025-11-15T14:00:00Z',
    duration_days: 0,
    chief_complaint: 'Routine diabetes and hypertension follow-up',
    diagnosis: 'Type 2 DM - suboptimal control, Hypertension - controlled',
    status: 'DISCHARGED',
    assigned_doctors: ['doc-2'],
    created_by: 'doc-2',
    created_at: '2025-11-15T14:00:00Z',
    updated_at: '2025-11-15T15:30:00Z',
  },
];

/**
 * Example queries to try with the AI assistant for this patient:
 * 
 * 1. "Does this patient have any allergies?" 
 * 2. "What medications is the patient currently taking?"
 * 3. "Show me the latest vital signs"
 * 4. "What are the latest lab results?"
 * 5. "What was the troponin level?"
 * 6. "Tell me about the patient's cardiac history"
 * 7. "What is the patient's kidney function?"
 * 8. "Show me the ECG findings"
 * 9. "Is the patient's diabetes well controlled?"
 * 10. "What medications are currently active for this admission?"
 */
