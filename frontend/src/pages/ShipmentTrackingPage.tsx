import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { IBooking } from '../types';
import { ShipmentTimeline } from '../components/ShipmentTimeline';
import { Badge } from '../components/Badge';
import { Truck, ArrowLeft, MessageSquare, MapPin, PackageCheck } from 'lucide-react';

export const ShipmentTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<IBooking | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await api.get(`/bookings/${id}`);
        if (res.data.success) {
          setBooking(res.data.booking);
          setConversationId(res.data.conversationId);
        }
      } catch (err) {
        console.error('Error fetching booking tracking data', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading shipment status...</div>;
  }

  if (!booking) {
    return <div className="text-center py-20 text-slate-500 font-semibold">Booking tracking not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back Button & Title Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/trader/dashboard"
          className="inline-flex items-center space-x-1.5 text-sm font-bold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="space-x-2">
          <Badge status={booking.bookingStatus} />
          <Badge status={booking.paymentStatus} />
        </div>
      </div>

      {/* Booking Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-xs font-bold uppercase text-slate-400">Tracking Reference</span>
          <h1 className="text-2xl font-extrabold text-slate-900">{booking.bookingNumber}</h1>
          <p className="text-sm font-semibold text-slate-600 mt-0.5">
            {booking.route.origin} → {booking.route.destination} ({booking.route.transportMode})
          </p>
        </div>
        <Link
          to="/trader/messages"
          className="px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl font-bold text-xs transition flex items-center space-x-1.5"
        >
          <MessageSquare className="h-4 w-4" />
          <span>Chat with Provider</span>
        </Link>
      </div>

      {/* Visual Shipment Timeline */}
      <ShipmentTimeline currentStatus={booking.bookingStatus} statusHistory={booking.statusHistory} />

      {/* Consignment & Logistics Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-sm">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <PackageCheck className="h-4 w-4 text-blue-600" />
            <span>Consignment Specifications</span>
          </h3>
          <div className="space-y-1.5 text-slate-600">
            <div className="flex justify-between">
              <span>Goods Type:</span>
              <strong className="text-slate-900">{booking.cargoDetails.cargoType}</strong>
            </div>
            <div className="flex justify-between">
              <span>Packages:</span>
              <strong className="text-slate-900">{booking.cargoDetails.numberOfPackages} Cartons</strong>
            </div>
            <div className="flex justify-between">
              <span>Weight / Volume:</span>
              <strong className="text-slate-900">
                {booking.cargoDetails.weightKg} KG / {booking.cargoDetails.volumeCbm} CBM
              </strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-sm">
          <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span>Pickup Details</span>
          </h3>
          <div className="space-y-1.5 text-slate-600">
            <div>
              <span className="block text-xs text-slate-400 font-semibold">Address:</span>
              <strong className="text-slate-900">{booking.pickupDetails.pickupAddress}</strong>
            </div>
            <div>
              <span className="block text-xs text-slate-400 font-semibold">Scheduled Date:</span>
              <strong className="text-slate-900">
                {new Date(booking.pickupDetails.pickupDate).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
