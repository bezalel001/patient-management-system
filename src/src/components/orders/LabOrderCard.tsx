import { TestTube, Calendar, AlertCircle, Check } from 'lucide-react';
import { LabOrder } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDateTime } from '../../utils/formatters';

interface LabOrderCardProps {
  order: LabOrder;
  onClick?: () => void;
}

export function LabOrderCard({ order, onClick }: LabOrderCardProps) {
  return (
    <Card onClick={onClick}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <TestTube size={20} className="text-purple-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{order.order_number}</h3>
                <Badge status={order.status}>{order.status}</Badge>
                <Badge status={order.priority}>{order.priority}</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-1">{order.test_name}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="space-y-3">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-gray-500">Category:</span>
          <span className="text-gray-900">{order.test_category}</span>
        </div>
        
        {order.clinical_notes && (
          <div className="flex items-start gap-2 text-sm">
            <span className="text-gray-500">Notes:</span>
            <span className="text-gray-700">{order.clinical_notes}</span>
          </div>
        )}
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={14} />
          <span>Ordered on {formatDateTime(order.ordered_at)}</span>
        </div>
        
        {order.ordered_by_name && (
          <div className="text-sm text-gray-600">
            Ordered by: <span className="text-gray-900">{order.ordered_by_name}</span>
          </div>
        )}
        
        {order.technician_name && (
          <div className="text-sm text-gray-600">
            Technician: <span className="text-gray-900">{order.technician_name}</span>
          </div>
        )}
        
        {order.completed_at && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <Check size={14} />
            <span>Completed on {formatDateTime(order.completed_at)}</span>
          </div>
        )}
        
        {order.results && order.results.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm text-gray-900 mb-3">Results ({order.results.length} parameters)</h4>
            <div className="space-y-2">
              {order.results.slice(0, 3).map((result) => (
                <div
                  key={result.id}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    result.is_abnormal ? 'bg-red-50' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.is_abnormal && <AlertCircle size={14} className="text-red-600" />}
                    <span className="text-sm text-gray-700">{result.parameter_name}</span>
                  </div>
                  <div className="text-sm">
                    <span className={result.is_abnormal ? 'text-red-600' : 'text-gray-900'}>
                      {result.result_value} {result.unit}
                    </span>
                    {result.reference_range && (
                      <span className="text-gray-500 ml-2">({result.reference_range})</span>
                    )}
                  </div>
                </div>
              ))}
              {order.results.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{order.results.length - 3} more parameters
                </p>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
