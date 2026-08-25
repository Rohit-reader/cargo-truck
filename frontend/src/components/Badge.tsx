import React from 'react';

interface BadgeProps {
  status: string;
  type?: 'status' | 'verification' | 'mode' | 'custom';
}

export const Badge: React.FC<BadgeProps> = ({ status, type = 'status' }) => {
  const getBadgeStyle = () => {
    switch (status.toLowerCase()) {
      case 'available':
      case 'approved':
      case 'verified':
      case 'confirmed':
      case 'successful':
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';

      case 'pending':
      case 'under review':
      case 'cargo pickup scheduled':
      case 'cargo picked up':
        return 'bg-amber-50 text-amber-700 border-amber-200';

      case 'in transit':
      case 'arrived at destination':
        return 'bg-blue-50 text-blue-700 border-blue-200';

      case 'fully booked':
      case 'rejected':
      case 'failed':
      case 'suspended':
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';

      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}>
      {status}
    </span>
  );
};
