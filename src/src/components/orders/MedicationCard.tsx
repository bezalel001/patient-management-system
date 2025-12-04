import { Package, Calendar, Clock } from 'lucide-react';
import { MedicationOrder } from '../../types';
import { Card, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

interface MedicationCardProps {
  medication: MedicationOrder;
}

export function MedicationCard({ medication }: MedicationCardProps) {
  return (
    <Card>
      <CardBody>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Package size={20} className="text-green-600" />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-gray-900">{medication.medication_name}</h3>
                <Badge status={medication.status}>{medication.status}</Badge>
              </div>
              
              <p className="text-sm text-gray-600">
                {medication.dosage} • {medication.route} • {medication.frequency}
              </p>
              
              <p className="text-sm text-gray-600 mt-1">
                Duration: {medication.duration_days} days
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">{medication.order_number}</p>
          </div>
        </div>
        
        {medication.instructions && (
          <div className="mb-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="text-blue-700">Instructions:</span> {medication.instructions}
            </p>
          </div>
        )}
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar size={14} />
            <span>Prescribed on {formatDateTime(medication.prescribed_at)}</span>
          </div>
          
          {medication.prescribed_by_name && (
            <div className="text-gray-600">
              Prescribed by: <span className="text-gray-900">{medication.prescribed_by_name}</span>
            </div>
          )}
          
          {medication.dispensed_at && (
            <div className="flex items-center gap-2 text-green-600">
              <Clock size={14} />
              <span>Dispensed on {formatDateTime(medication.dispensed_at)}</span>
            </div>
          )}
          
          {medication.dispensed_by_name && (
            <div className="text-gray-600">
              Dispensed by: <span className="text-gray-900">{medication.dispensed_by_name}</span>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
