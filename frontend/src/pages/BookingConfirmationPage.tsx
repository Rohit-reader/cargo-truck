import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, MessageSquare, Truck, ArrowRight, ShieldCheck } from 'lucide-react';
import { Badge } from '../components/Badge';

export const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;
  const payment = location.state?.payment;

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Booking Information Found</h2>
        <Link to="/trader/bookings" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-sm">
          Go to My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
      {/* Confirmation Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Booking Confirmed!</h1>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Your cargo space reservation has been processed and payment verified.
        </p>
        <span className="inline-block bg-blue-50 text-blue-800 px-4 py-1.5 rounded-full text-xs font-extrabold border border-blue-200">
          Booking Reference: {booking.bookingNumber}
        </span>
      </div>

      {/* Booking Summary Details Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 text-sm">
        <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Shipment Summary</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Route</span>
            <span className="font-bold text-slate-900">{booking.route.origin} → {booking.route.destination}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Logistics Provider</span>
            <span className="font-bold text-slate-900">{booking.providerName}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Container & Mode</span>
            <span className="font-semibold text-slate-800">
              {booking.route.transportMode} • {booking.route.containerNumber}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Reserved Capacity</span>
            <span className="font-semibold text-slate-800">
              {booking.cargoDetails.weightKg} KG / {booking.cargoDetails.volumeCbm} CBM
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Amount Paid</span>
            <span className="font-extrabold text-emerald-700 text-base">
              ₹{booking.priceSummary.totalAmount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block">Status</span>
            <div className="space-x-1 mt-0.5">
              <Badge status={booking.paymentStatus} />
              <Badge status={booking.bookingStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={`/trader/tracking/${booking._id}`}
          className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow-sm transition text-center flex items-center justify-center space-x-2 text-sm"
        >
          <Truck className="h-4 w-4" />
          <span>View Shipment</span>
        </Link>
        <Link
          to="/trader/messages"
          className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition text-center flex items-center justify-center space-x-2 text-sm"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat With Provider</span>
        </Link>
      </div>
    </div>
  );
};
