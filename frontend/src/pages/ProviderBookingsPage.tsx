import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IBooking, BookingStatus } from '../types';
import { Badge } from '../components/Badge';
import { PackageCheck, Truck, Clock, MessageSquare, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProviderBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, newStatus: BookingStatus) => {
    setUpdatingId(bookingId);
    try {
      const res = await api.put(`/bookings/${bookingId}/shipment-status`, {
        status: newStatus,
        note: `Status updated to ${newStatus} by logistics provider.`,
      });
      if (res.data.success) {
        fetchBookings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <PackageCheck className="h-6 w-6 text-blue-600" />
          <span>Received Consignment Bookings</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Review bookings from traders and update shipment tracking status along the delivery timeline
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading bookings...</div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-3">
          <PackageCheck className="h-10 w-10 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Bookings Found</h3>
          <p className="text-slate-500 text-sm">You haven't received any bookings for your listed cargo space yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Trader Name</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Cargo Spec</th>
                  <th className="px-4 py-3">Pickup Address</th>
                  <th className="px-4 py-3">Current Status</th>
                  <th className="px-4 py-3 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-4 font-bold text-slate-900">{b.bookingNumber}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-900 block">{b.traderName}</span>
                      <span className="text-xs text-slate-400">{b.traderEmail}</span>
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {b.route.origin} → {b.route.destination}
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600">
                      <strong className="block text-slate-900">{b.cargoDetails.cargoType}</strong>
                      {b.cargoDetails.weightKg} KG / {b.cargoDetails.volumeCbm} CBM
                    </td>
                    <td className="px-4 py-4 text-xs text-slate-600 max-w-xs truncate" title={b.pickupDetails.pickupAddress}>
                      {b.pickupDetails.pickupAddress}
                    </td>
                    <td className="px-4 py-4">
                      <Badge status={b.bookingStatus} />
                    </td>
                    <td className="px-4 py-4 text-right">
                      {b.bookingStatus === 'Delivered' || b.bookingStatus === 'Cancelled' ? (
                        <span className="text-xs font-bold text-slate-400 uppercase">Final State</span>
                      ) : (
                        <select
                          disabled={updatingId === b._id}
                          value={b.bookingStatus}
                          onChange={(e) => handleUpdateStatus(b._id, e.target.value as BookingStatus)}
                          className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xs rounded-lg cursor-pointer focus:outline-none"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Cargo Pickup Scheduled">Schedule Pickup</option>
                          <option value="Cargo Picked Up">Mark Picked Up</option>
                          <option value="In Transit">Mark In Transit</option>
                          <option value="Arrived at Destination">Mark Arrived</option>
                          <option value="Delivered">Mark Delivered</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
