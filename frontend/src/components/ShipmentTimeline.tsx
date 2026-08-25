import React from 'react';
import { BookingStatus } from '../types';
import { CheckCircle2, Clock, Truck, Package, Anchor, Home } from 'lucide-react';

interface ShipmentTimelineProps {
  currentStatus: BookingStatus;
  statusHistory?: Array<{
    status: BookingStatus;
    updatedAt: string;
    updatedBy: string;
    note?: string;
  }>;
}

const TIMELINE_STEPS: { status: BookingStatus; label: string; icon: any }[] = [
  { status: 'Confirmed', label: 'Booking Confirmed', icon: CheckCircle2 },
  { status: 'Cargo Pickup Scheduled', label: 'Pickup Scheduled', icon: Clock },
  { status: 'Cargo Picked Up', label: 'Cargo Picked Up', icon: Package },
  { status: 'In Transit', label: 'In Transit', icon: Truck },
  { status: 'Arrived at Destination', label: 'Arrived at Port', icon: Anchor },
  { status: 'Delivered', label: 'Delivered', icon: Home },
];

export const ShipmentTimeline: React.FC<ShipmentTimelineProps> = ({ currentStatus, statusHistory = [] }) => {
  const getStepIndex = (status: BookingStatus) => {
    return TIMELINE_STEPS.findIndex((s) => s.status === status);
  };

  const currentIndex = getStepIndex(currentStatus);
  const isCancelled = currentStatus === 'Cancelled';

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
      <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
        <Truck className="h-5 w-5 text-blue-600" />
        <span>Shipment Tracking Timeline</span>
      </h3>

      {isCancelled ? (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm font-semibold">
          This booking has been Cancelled. Reserved container capacity was restored.
        </div>
      ) : (
        <div className="relative">
          {/* Progress Bar Line */}
          <div className="hidden md:block absolute top-5 left-6 right-6 h-1 bg-slate-200 -z-0">
            <div
              className="h-full bg-blue-600 transition-all duration-700"
              style={{
                width: `${(Math.max(0, currentIndex) / (TIMELINE_STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 relative z-10">
            {TIMELINE_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              const historyItem = statusHistory.find((h) => h.status === step.status);

              return (
                <div key={step.status} className="flex md:flex-col items-center md:text-center space-x-3 md:space-x-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 ring-4 ring-blue-100 shadow-md'
                        : isCompleted
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-400 border-slate-300'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="md:mt-3">
                    <span
                      className={`block text-xs font-bold ${
                        isCurrent ? 'text-blue-700 font-extrabold' : isCompleted ? 'text-slate-900 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </span>
                    {historyItem && (
                      <span className="block text-[11px] text-slate-400 mt-0.5">
                        {new Date(historyItem.updatedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
