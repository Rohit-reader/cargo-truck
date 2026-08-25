import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { PackageCheck, Truck, CreditCard, MessageSquare, Search, ArrowRight } from 'lucide-react';

export const TraderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load trader bookings', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const activeBookings = bookings.filter((b) => b.bookingStatus !== 'Delivered' && b.bookingStatus !== 'Cancelled');
  const completedShipments = bookings.filter((b) => b.bookingStatus === 'Delivered');
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === 'Successful')
    .reduce((sum, b) => sum + b.priceSummary.totalAmount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h1 className="text-2xl font-extrabold">Welcome back, {user?.fullName}!</h1>
          <p className="text-blue-200 text-sm mt-0.5">
            Trader Exporter Dashboard • Manage your cargo bookings and track shipments in real-time
          </p>
        </div>
        <Link
          to="/search"
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-sm rounded-xl transition flex items-center space-x-1.5 shadow-sm whitespace-nowrap"
        >
          <Search className="h-4 w-4" />
          <span>Find Available Space</span>
        </Link>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Active Bookings</span>
            <PackageCheck className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{activeBookings.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Completed Shipments</span>
            <Truck className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{completedShipments.length}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Total Freight Spent</span>
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">₹{totalSpent.toLocaleString()}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Messages & Support</span>
            <MessageSquare className="h-5 w-5 text-amber-600" />
          </div>
          <Link to="/trader/messages" className="text-sm font-bold text-blue-600 hover:underline block pt-1">
            Open Chat Center →
          </Link>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Consignment Bookings</h2>
          <Link to="/trader/bookings" className="text-xs font-bold text-blue-600 hover:underline">
            View All Bookings
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8 text-slate-400 text-sm">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm space-y-3">
            <p>You have not booked any cargo space yet.</p>
            <Link to="/search" className="inline-block px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl">
              Search Cargo Space
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Reserved Space</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 font-bold text-slate-900">{booking.bookingNumber}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      {booking.route.origin} → {booking.route.destination}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{booking.providerName}</td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {booking.cargoDetails.weightKg} KG / {booking.cargoDetails.volumeCbm} CBM
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      ₹{booking.priceSummary.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={booking.bookingStatus} />
                    </td>
                    <td className="px-4 py-3.5 text-right space-x-2">
                      <Link
                        to={`/trader/tracking/${booking._id}`}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                      >
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
