import { Calendar, Clock, User as UserIcon, Activity, Building } from 'lucide-react';
import { Visit } from '../../types';
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

interface VisitCardProps {
  visit: Visit;
  onClick?: () => void;
}

export function VisitCard({ visit, onClick }: VisitCardProps) {
  return (
    <Card onClick={onClick}>
      <CardBody>
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-gray-900">{visit.visit_number}</h3>
              <Badge status={visit.status}>{visit.status}</Badge>
              <Badge status={visit.visit_type}>{visit.visit_type}</Badge>
            </div>
            
            {visit.patient_details && (
              <p className="text-sm text-gray-600">
                {visit.patient_details.first_name} {visit.patient_details.last_name} 
                <span className="text-gray-400 ml-2">({visit.patient_details.mrn})</span>
              </p>
            )}
          </div>
          
          <div className="text-left sm:text-right self-start">
            <p className="text-sm text-gray-500">{visit.duration_days} days</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-sm text-gray-600">
            <Calendar size={16} className="flex-shrink-0 mt-0.5" />
            <span className="break-words">Admitted: {formatDateTime(visit.admission_datetime)}</span>
          </div>
          
          {visit.discharge_datetime && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Clock size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">Discharged: {formatDateTime(visit.discharge_datetime)}</span>
            </div>
          )}
          
          {visit.visit_type === 'IPD' && visit.bed_number && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <Building size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">{visit.ward} - Bed {visit.bed_number}</span>
            </div>
          )}
          
          <div className="flex items-start gap-2 text-sm text-gray-700">
            <Activity size={16} className="mt-0.5 flex-shrink-0" />
            <span className="break-words">{visit.chief_complaint}</span>
          </div>
          
          {visit.assigned_doctors_details && visit.assigned_doctors_details.length > 0 && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <UserIcon size={16} className="flex-shrink-0 mt-0.5" />
              <span className="break-words">
                Dr. {visit.assigned_doctors_details[0].full_name}
                {visit.assigned_doctors_details.length > 1 && (
                  <span className="text-gray-400 ml-1">+{visit.assigned_doctors_details.length - 1} more</span>
                )}
              </span>
            </div>
          )}
        </div>
        
        {(visit.vital_signs?.length || visit.lab_orders?.length || visit.medication_orders?.length) && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-3 sm:gap-4 text-sm">
            {visit.vital_signs && visit.vital_signs.length > 0 && (
              <span className="text-gray-600 whitespace-nowrap">📊 {visit.vital_signs.length} Vitals</span>
            )}
            {visit.lab_orders && visit.lab_orders.length > 0 && (
              <span className="text-gray-600 whitespace-nowrap">🧪 {visit.lab_orders.length} Lab Orders</span>
            )}
            {visit.medication_orders && visit.medication_orders.length > 0 && (
              <span className="text-gray-600 whitespace-nowrap">💊 {visit.medication_orders.length} Medications</span>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}