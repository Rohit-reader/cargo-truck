import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { IProviderProfile, IBooking } from '../types';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/Badge';
import { Boxes, PackageCheck, CreditCard, Star, ShieldCheck, Plus, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ProviderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<IProviderProfile | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profRes, bookRes] = await Promise.all([
          api.get('/providers/profile'),
          api.get('/bookings'),
        ]);

        if (profRes.data.success) {
          setProfile(profRes.data.provider);
          setStats(profRes.data.stats);
        }
        if (bookRes.data.success) {
          setBookings(bookRes.data.bookings);
        }
      } catch (err) {
        console.error('Failed to load provider dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartData = [
    { name: 'Chennai → Dubai', weightBooked: 6000, capacity: 18000 },
    { name: 'Chennai → Singapore', weightBooked: 4000, capacity: 26000 },
    { name: 'Chennai → Colombo', weightBooked: 6500, capacity: 15000 },
    { name: 'Chennai → Mumbai', weightBooked: 9000, capacity: 24000 },
    { name: 'Coimbatore → Chennai', weightBooked: 3000, capacity: 12000 },
  ];

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading provider dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Provider Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900">{profile?.companyName}</h1>
            {profile?.verificationStatus === 'Approved' ? (
              <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                Verified Provider
              </span>
            ) : (
              <Badge status={profile?.verificationStatus || 'Pending'} />
            )}
          </div>
          <p className="text-slate-500 text-sm mt-0.5">
            Logistics Provider Portal • Manage container listings, incoming bookings & shipment updates
          </p>
        </div>

        <Link
          to="/provider/cargo-space"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-sm transition flex items-center space-x-1.5 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span>Publish Cargo Space</span>
        </Link>
      </div>

      {/* Verification Alert if Pending */}
      {profile?.verificationStatus !== 'Approved' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-xs text-amber-800 flex items-center justify-between">
          <div>
            <span className="font-bold block text-sm">Provider Application Under Review</span>
            <span>Upload verification documents to complete your Admin approval.</span>
          </div>
          <Link
            to="/provider/verification"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-lg shadow-xs transition"
          >
            Upload Verification Docs
          </Link>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Active Space</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats?.activeCargoSpace || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Total Bookings</span>
          <span className="text-2xl font-extrabold text-slate-900 block">{stats?.totalBookings || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Pending</span>
          <span className="text-2xl font-extrabold text-amber-600 block">{stats?.pendingBookings || 0}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Revenue</span>
          <span className="text-xl font-extrabold text-emerald-700 block">₹{(stats?.revenue || 0).toLocaleString()}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Utilization</span>
          <span className="text-2xl font-extrabold text-blue-600 block">{stats?.utilizationRate || 0}%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-400 text-xs font-semibold uppercase">Customer Rating</span>
          <span className="text-2xl font-extrabold text-amber-500 block flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current" />
            <span>{profile?.rating || 4.8}</span>
          </span>
        </div>
      </div>

      {/* Utilization Chart (Recharts) */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Container Capacity Utilization Analytics</span>
        </h3>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="weightBooked" fill="#2563eb" radius={[4, 4, 0, 0]} name="Booked Weight (KG)" />
              <Bar dataKey="capacity" fill="#cbd5e1" radius={[4, 4, 0, 0]} name="Total Capacity (KG)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Received */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base">Incoming Trader Bookings</h3>
          <Link to="/provider/bookings" className="text-xs font-bold text-blue-600 hover:underline">
            Manage All Bookings
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm">No bookings received yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Booking Ref</th>
                  <th className="px-4 py-3">Trader</th>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Reserved Weight</th>
                  <th className="px-4 py-3">Freight Value</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 font-bold text-slate-900">{booking.bookingNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{booking.traderName}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {booking.route.origin} → {booking.route.destination}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{booking.cargoDetails.weightKg} KG</td>
                    <td className="px-4 py-3 font-bold text-slate-900">
                      ₹{booking.priceSummary.baseFreight.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={booking.bookingStatus} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/provider/bookings"
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition"
                      >
                        Update Status
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
