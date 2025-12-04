import { Activity, Heart, Droplet } from 'lucide-react';
import { VitalSigns } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';
import { formatDateTime } from '../../utils/formatters';

interface VitalsCardProps {
  vitals: VitalSigns;
}

export function VitalsCard({ vitals }: VitalsCardProps) {
  const vitalItems = [
    {
      label: 'Temperature',
      value: vitals.temperature_celsius,
      unit: '°C',
      icon: Activity,
      normal: vitals.temperature_celsius && vitals.temperature_celsius >= 36.5 && vitals.temperature_celsius <= 37.5,
    },
    {
      label: 'Blood Pressure',
      value: vitals.systolic_bp && vitals.diastolic_bp ? `${vitals.systolic_bp}/${vitals.diastolic_bp}` : null,
      unit: 'mmHg',
      icon: Heart,
      normal: vitals.systolic_bp && vitals.systolic_bp >= 90 && vitals.systolic_bp <= 140,
    },
    {
      label: 'Heart Rate',
      value: vitals.heart_rate,
      unit: 'bpm',
      icon: Heart,
      normal: vitals.heart_rate && vitals.heart_rate >= 60 && vitals.heart_rate <= 100,
    },
    {
      label: 'Respiratory Rate',
      value: vitals.respiratory_rate,
      unit: '/min',
      icon: Activity,
      normal: vitals.respiratory_rate && vitals.respiratory_rate >= 12 && vitals.respiratory_rate <= 20,
    },
    {
      label: 'SpO2',
      value: vitals.oxygen_saturation,
      unit: '%',
      icon: Droplet,
      normal: vitals.oxygen_saturation && vitals.oxygen_saturation >= 95,
    },
    {
      label: 'Weight',
      value: vitals.weight_kg,
      unit: 'kg',
      icon: Activity,
      normal: true,
    },
    {
      label: 'Height',
      value: vitals.height_cm,
      unit: 'cm',
      icon: Activity,
      normal: true,
    },
    {
      label: 'BMI',
      value: vitals.bmi,
      unit: '',
      icon: Activity,
      normal: vitals.bmi && vitals.bmi >= 18.5 && vitals.bmi < 25,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-900">Vital Signs</h3>
            <p className="text-sm text-gray-500 mt-1">
              Recorded by {vitals.recorded_by_name} on {formatDateTime(vitals.recorded_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {vitalItems.map((item, index) => {
            if (!item.value) return null;
            
            const Icon = item.icon;
            const isAbnormal = !item.normal;
            
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isAbnormal ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={16} className={isAbnormal ? 'text-red-600' : 'text-gray-600'} />
                  <span className="text-xs text-gray-600">{item.label}</span>
                </div>
                <p className={`text-gray-900 ${isAbnormal ? 'text-red-600' : ''}`}>
                  {item.value} <span className="text-sm text-gray-500">{item.unit}</span>
                </p>
              </div>
            );
          })}
        </div>
        
        {vitals.notes && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="text-gray-900">Notes:</span> {vitals.notes}
            </p>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
