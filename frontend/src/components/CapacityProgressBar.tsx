import React from 'react';

interface CapacityProgressBarProps {
  total: number;
  available: number;
  unit: string;
  label: string;
}

export const CapacityProgressBar: React.FC<CapacityProgressBarProps> = ({
  total,
  available,
  unit,
  label,
}) => {
  const booked = Math.max(0, total - available);
  const percentage = total > 0 ? Math.min(100, Math.round((booked / total) * 100)) : 0;
  const availablePercentage = 100 - percentage;

  // Calculate filled width in trailer container (container width = 740px in viewBox)
  const trailerWidth = 740;
  const filledWidth = Math.max(0, (trailerWidth * percentage) / 100);

  // Generate colorful cargo boxes inside the filled space
  const generateCargoBoxes = () => {
    if (filledWidth <= 0) return null;

    const colors = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#0891b2', '#dc2626', '#4f46e5'];
    const boxWidth = 35;
    const boxHeight = 28;
    const rows = 4;
    const cols = Math.floor(filledWidth / boxWidth);
    const boxes = [];

    let keyIdx = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = 225 + c * boxWidth;
        const y = 205 - r * (boxHeight + 2);
        const color = colors[(c * 3 + r * 7) % colors.length];
        boxes.push(
          <g key={keyIdx++}>
            <rect
              x={x}
              y={y}
              width={boxWidth - 2}
              height={boxHeight}
              rx={3}
              fill={color}
              stroke="#ffffff"
              strokeWidth="1.5"
              className="transition-all duration-500"
            />
            {/* Box tape line graphic detail */}
            <line
              x1={x + (boxWidth - 2) / 2}
              y1={y}
              x2={x + (boxWidth - 2) / 2}
              y2={y + boxHeight}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
          </g>
        );
      }
    }
    return boxes;
  };

  return (
    <div className="space-y-2">
      {/* Top Header Label */}
      <div className="flex justify-between items-center text-xs">
        <span className="font-extrabold text-slate-800 tracking-wide uppercase">{label}</span>
        <span className="font-bold text-slate-900">
          <span className="text-emerald-700 font-extrabold">{available.toLocaleString()} {unit} Available</span>{' '}
          <span className="text-slate-400 font-normal">({total.toLocaleString()} {unit} Total)</span>
        </span>
      </div>

      {/* Real Semi-Trailer Truck SVG Graphic matching line drawing */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-sm hover:shadow-md transition">
        <div className="relative w-full">
          <svg viewBox="0 0 1000 310" className="w-full h-auto max-h-40 overflow-visible">
            <defs>
              {/* Colored Gradient Fill for Container Cargo Background */}
              <linearGradient id="cargoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
              </linearGradient>

              {/* Stripe pattern for empty trailer space */}
              <pattern id="emptyPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                <line x1="0" y1="16" x2="16" y2="0" stroke="#e2e8f0" strokeWidth="1.5" />
              </pattern>
            </defs>

            {/* 1. TRAILER CONTAINER CONTAINER BODY (OUTLINE) */}
            {/* Empty Space Background with diagonal subtle stripes */}
            <rect x="220" y="70" width="750" height="150" fill="url(#emptyPattern)" rx="4" />

            {/* Booked Capacity Filled Background */}
            {filledWidth > 0 && (
              <rect
                x="220"
                y="70"
                width={filledWidth}
                height="150"
                fill="url(#cargoGradient)"
                rx="4"
                className="transition-all duration-700"
              />
            )}

            {/* Colorful Loaded Goods (Stacked Boxes) */}
            {generateCargoBoxes()}

            {/* Outer Trailer Frame Line Drawing (matches user line art) */}
            <rect
              x="220"
              y="70"
              width="750"
              height="150"
              fill="none"
              stroke="#0f172a"
              strokeWidth="3.5"
              rx="4"
            />

            {/* Vertical Rib Lines on Container Rear Panel */}
            <line x1="960" y1="70" x2="960" y2="220" stroke="#0f172a" strokeWidth="2.5" />
            <line x1="950" y1="70" x2="950" y2="220" stroke="#0f172a" strokeWidth="1.5" />

            {/* Capacity % Badge Overlay in Center of Container */}
            <g transform="translate(595, 145)">
              <rect
                x="-85"
                y="-18"
                width="170"
                height="36"
                rx="18"
                fill="#ffffff"
                stroke="#0f172a"
                strokeWidth="2"
                className="shadow-sm"
              />
              <text
                x="0"
                y="5"
                textAnchor="middle"
                className="text-xs font-black fill-slate-900 tracking-wider"
                style={{ fontSize: '14px', fontWeight: '900' }}
              >
                {percentage}% LOADED
              </text>
            </g>

            {/* 2. SEMI TRUCK DRIVER CABIN (LINE ART MATCHING IMAGE) */}
            {/* Cab Main Outer Contour */}
            <path
              d="M 15 220 L 15 150 C 15 125, 40 90, 70 85 L 180 85 L 195 85 L 195 220 Z"
              fill="#ffffff"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Cab Windshield & Side Window Contour */}
            <path
              d="M 45 145 L 105 145 L 105 190 L 35 190 Z"
              fill="#e2e8f0"
              stroke="#0f172a"
              strokeWidth="2.5"
            />
            {/* Door Line & Handle */}
            <line x1="112" y1="145" x2="112" y2="220" stroke="#0f172a" strokeWidth="2" />
            <rect x="90" y="195" width="12" height="6" rx="2" fill="#0f172a" />

            {/* Rear Mirror */}
            <path d="M 40 155 L 48 155 L 48 178 L 40 178 Z" fill="#0f172a" />
            <line x1="45" y1="155" x2="35" y2="165" stroke="#0f172a" strokeWidth="2" />

            {/* Cab Bumper & Lower Trim */}
            <path d="M 10 220 L 195 220 L 195 235 L 20 235 Z" fill="#f8fafc" stroke="#0f172a" strokeWidth="3" />

            {/* 3. UNDER-CARRIAGE FRAME & BATTERY BOX */}
            <line x1="195" y1="220" x2="220" y2="220" stroke="#0f172a" strokeWidth="4" />
            <line x1="220" y1="230" x2="960" y2="230" stroke="#0f172a" strokeWidth="3.5" />
            {/* Under-carriage Battery/Tool Box (matching image) */}
            <rect x="450" y="235" width="200" height="25" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" rx="3" />

            {/* 4. WHEELS (EXACT WHEEL LOCATIONS FROM USER DRAWING) */}
            {/* Wheel 1: Front Steering Wheel under Cab */}
            <g transform="translate(105, 245)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="0" cy="0" r="6" fill="#0f172a" />
            </g>

            {/* Wheel 2: Mid-axle Wheel under front of trailer */}
            <g transform="translate(390, 245)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="0" cy="0" r="6" fill="#0f172a" />
            </g>

            {/* Rear Triple Axle Wheels (matching user drawing) */}
            {/* Wheel 3 */}
            <g transform="translate(710, 245)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="0" cy="0" r="6" fill="#0f172a" />
            </g>
            {/* Wheel 4 */}
            <g transform="translate(795, 245)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="0" cy="0" r="6" fill="#0f172a" />
            </g>
            {/* Wheel 5 */}
            <g transform="translate(880, 245)">
              <circle cx="0" cy="0" r="32" fill="#ffffff" stroke="#0f172a" strokeWidth="4" />
              <circle cx="0" cy="0" r="18" fill="#ffffff" stroke="#0f172a" strokeWidth="3" />
              <circle cx="0" cy="0" r="6" fill="#0f172a" />
            </g>
          </svg>
        </div>

        {/* Legend Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-blue-600 inline-block" />
              <span className="text-slate-600 font-medium">Loaded Goods ({booked.toLocaleString()} {unit})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-slate-200 border border-slate-300 inline-block" />
              <span className="text-slate-600 font-medium">Free Capacity ({available.toLocaleString()} {unit})</span>
            </span>
          </div>

          <span className="font-extrabold text-blue-700">
            {availablePercentage}% Remaining Space
          </span>
        </div>
      </div>
    </div>
  );
};
