import React from 'react';

interface CapacityProgressBarProps {
  total: number;
  available: number;
  unit: string;
  label: string;
}

export const CapacityProgressBar: React.FC<CapacityProgressBarProps> = ({ total, available, unit, label }) => {
  const booked = Math.max(0, total - available);
  const percentage = total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="font-semibold text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">
          {available.toLocaleString()} {unit} Available{' '}
          <span className="text-slate-400 font-normal">({total.toLocaleString()} {unit} Total)</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200 flex">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
          title={`${percentage}% Capacity Reserved`}
        />
      </div>
    </div>
  );
};
