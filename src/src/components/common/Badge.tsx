import { STATUS_COLORS } from '../../utils/constants';

interface BadgeProps {
  status: string;
  children?: React.ReactNode;
}

export function Badge({ status, children }: BadgeProps) {
  const colorClass = STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-800';
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {children || status}
    </span>
  );
}
