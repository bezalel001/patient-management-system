import { User, Phone, Calendar, Droplet } from 'lucide-react';
import { Patient } from '../../types';
import { Card, CardBody } from '../common/Card';
import { formatDate } from '../../utils/formatters';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
}

export function PatientCard({ patient, onClick }: PatientCardProps) {
  return (
    <Card onClick={onClick}>
      <CardBody>
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
              <User size={20} className="sm:w-6 sm:h-6" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="text-gray-900">{patient.first_name} {patient.last_name}</h3>
                <span className="text-sm text-gray-500">({patient.age} yrs)</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-2">MRN: {patient.mrn}</p>
              
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Phone size={14} />
                  <span className="truncate">{patient.phone}</span>
                </div>
                
                {patient.blood_group && (
                  <div className="flex items-center gap-1">
                    <Droplet size={14} />
                    <span>{patient.blood_group}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span className="hidden sm:inline">{formatDate(patient.date_of_birth)}</span>
                  <span className="sm:hidden">{new Date(patient.date_of_birth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
              
              {patient.allergies && (
                <div className="mt-2 text-sm">
                  <span className="text-red-600">⚠️ Allergies: {patient.allergies}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right sm:text-right self-start flex sm:flex-col gap-2 sm:gap-0 items-center sm:items-end">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs whitespace-nowrap ${
              patient.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {patient.is_active ? 'Active' : 'Inactive'}
            </span>
            
            <p className="text-xs text-gray-500 sm:mt-2 whitespace-nowrap">
              <span className="hidden sm:inline">Registered </span>
              {formatDate(patient.created_at)}
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}