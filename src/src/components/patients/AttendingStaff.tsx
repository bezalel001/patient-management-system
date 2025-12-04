import { Users, Stethoscope, UserCheck } from 'lucide-react';
import { Visit } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';

interface AttendingStaffProps {
  visits: Visit[];
}

interface StaffMember {
  id: string;
  name: string;
  role: 'DOCTOR' | 'NURSE';
  visitCount: number;
  visits: string[]; // visit numbers
}

export function AttendingStaff({ visits }: AttendingStaffProps) {
  // Extract unique doctors and nurses from all visits
  const staffMap = new Map<string, StaffMember>();

  visits.forEach(visit => {
    // Process doctors
    visit.assigned_doctors?.forEach((doctorId, index) => {
      const doctorName = visit.assigned_doctor_names?.[index] || `Doctor ${doctorId}`;
      const key = `doctor-${doctorId}`;
      
      if (staffMap.has(key)) {
        const staff = staffMap.get(key)!;
        staff.visitCount++;
        staff.visits.push(visit.visit_number);
      } else {
        staffMap.set(key, {
          id: doctorId,
          name: doctorName,
          role: 'DOCTOR',
          visitCount: 1,
          visits: [visit.visit_number],
        });
      }
    });

    // Process nurses
    visit.assigned_nurses?.forEach((nurseId, index) => {
      const nurseName = visit.assigned_nurse_names?.[index] || `Nurse ${nurseId}`;
      const key = `nurse-${nurseId}`;
      
      if (staffMap.has(key)) {
        const staff = staffMap.get(key)!;
        staff.visitCount++;
        staff.visits.push(visit.visit_number);
      } else {
        staffMap.set(key, {
          id: nurseId,
          name: nurseName,
          role: 'NURSE',
          visitCount: 1,
          visits: [visit.visit_number],
        });
      }
    });
  });

  const staffMembers = Array.from(staffMap.values());
  const doctors = staffMembers.filter(s => s.role === 'DOCTOR');
  const nurses = staffMembers.filter(s => s.role === 'NURSE');

  if (staffMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-gray-600" />
            <h3 className="text-gray-900">Attending Staff</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 text-gray-300" />
            <p>No staff assigned to this patient's visits yet</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-gray-600" />
            <h3 className="text-gray-900">Attending Staff</h3>
          </div>
          <span className="text-sm text-gray-500">
            {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'}, {nurses.length} {nurses.length === 1 ? 'nurse' : 'nurses'}
          </span>
        </div>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Doctors Section */}
        {doctors.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Stethoscope size={16} className="text-blue-600" />
              <h4 className="text-gray-900">Doctors</h4>
            </div>
            <div className="space-y-3">
              {doctors.map(doctor => (
                <div
                  key={`doctor-${doctor.id}`}
                  className="flex items-start justify-between p-3 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-900 truncate">{doctor.name}</p>
                        <Badge status="info">Doctor</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Attended {doctor.visitCount} {doctor.visitCount === 1 ? 'visit' : 'visits'}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {doctor.visits.slice(0, 3).join(', ')}
                        {doctor.visits.length > 3 && ` +${doctor.visits.length - 3} more`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nurses Section */}
        {nurses.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck size={16} className="text-green-600" />
              <h4 className="text-gray-900">Nurses</h4>
            </div>
            <div className="space-y-3">
              {nurses.map(nurse => (
                <div
                  key={`nurse-${nurse.id}`}
                  className="flex items-start justify-between p-3 bg-green-50 rounded-lg border border-green-100"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white flex-shrink-0">
                      {nurse.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-gray-900 truncate">{nurse.name}</p>
                        <Badge status="success">Nurse</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Attended {nurse.visitCount} {nurse.visitCount === 1 ? 'visit' : 'visits'}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {nurse.visits.slice(0, 3).join(', ')}
                        {nurse.visits.length > 3 && ` +${nurse.visits.length - 3} more`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
