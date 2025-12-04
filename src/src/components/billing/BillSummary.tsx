import { DollarSign, FileText, Calendar } from 'lucide-react';
import { Bill } from '../../types';
import { Card, CardHeader, CardBody, CardFooter } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatCurrency, formatDateTime } from '../../utils/formatters';

interface BillSummaryProps {
  bill: Bill;
}

export function BillSummary({ bill }: BillSummaryProps) {
  const chargeItems = [
    { label: 'Consultation Fee', amount: bill.consultation_fee },
    { label: 'Lab Charges', amount: bill.lab_charges },
    { label: 'Radiology Charges', amount: bill.radiology_charges },
    { label: 'Medication Charges', amount: bill.medication_charges },
    { label: 'Bed Charges', amount: bill.bed_charges },
    { label: 'Procedure Charges', amount: bill.procedure_charges },
    { label: 'Other Charges', amount: bill.other_charges },
  ].filter(item => item.amount > 0);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{bill.bill_number}</h3>
                <Badge status={bill.payment_status}>{bill.payment_status}</Badge>
              </div>
              {bill.patient_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Patient: {bill.patient_name}
                </p>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">
              <Calendar size={14} className="inline mr-1" />
              {formatDateTime(bill.created_at)}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardBody>
        <div className="space-y-2">
          {chargeItems.map((item, index) => (
            <div key={index} className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">{item.label}</span>
              <span className="text-gray-900">{formatCurrency(item.amount)}</span>
            </div>
          ))}
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-700">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(bill.subtotal)}</span>
          </div>
          
          {bill.tax_amount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">+{formatCurrency(bill.tax_amount)}</span>
            </div>
          )}
          
          {bill.discount_amount > 0 && (
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-green-600">Discount</span>
              <span className="text-green-600">-{formatCurrency(bill.discount_amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-3 border-b border-gray-200">
            <span className="text-gray-900">Total Amount</span>
            <span className="text-gray-900">{formatCurrency(bill.total_amount)}</span>
          </div>
          
          {bill.paid_amount > 0 && (
            <div className="flex justify-between py-2">
              <span className="text-green-600">Paid Amount</span>
              <span className="text-green-600">-{formatCurrency(bill.paid_amount)}</span>
            </div>
          )}
          
          <div className="flex justify-between py-3 bg-blue-50 rounded-lg px-3 mt-2">
            <span className="text-blue-900">Balance Due</span>
            <span className="text-blue-900">{formatCurrency(bill.balance_amount)}</span>
          </div>
        </div>
        
        {bill.payment_method && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Payment Method: <span className="text-gray-900">{bill.payment_method}</span>
            </p>
          </div>
        )}
        
        {bill.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="text-gray-900">Notes:</span> {bill.notes}
            </p>
          </div>
        )}
      </CardBody>
      
      <CardFooter>
        <div className="flex gap-3">
          <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <DollarSign size={16} className="inline mr-1" />
            Record Payment
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Print Bill
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}
