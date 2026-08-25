import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { UserCheck, Users, Boxes, PackageCheck, CreditCard, Activity, ShieldCheck, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [popularRoutes, setPopularRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.data.success) {
          setStats(res.data.stats);
          setPopularRoutes(res.data.popularRoutes);
        }
      } catch (err) {
        console.error('Failed to load admin analytics', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const bookingVolumeData = [
    { month: 'May', bookings: 12, revenue: 14500 },
    { month: 'Jun', bookings: 19, revenue: 22000 },
    { month: 'Jul', bookings: 27, revenue: 34000 },
    { month: 'Aug', bookings: 42, revenue: 58000 },
  ];

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading admin portal...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-400" />
            <span>Sutrivazhi Platform Administration</span>
          </h1>
          <p className="text-slate-300 text-sm mt-0.5">
            System overview, logistics provider verification, container monitoring & marketplace analytics
          </p>
        </div>

        <Link
          to="/admin/applications"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-xl shadow-sm transition flex items-center space-x-1.5 whitespace-nowrap"
        >
          <UserCheck className="h-4 w-4" />
          <span>Review Applications ({stats?.pendingApplications || 0})</span>
        </Link>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Pending Applications</span>
            <UserCheck className="h-5 w-5 text-amber-600" />
          </div>
          <span className="text-3xl font-extrabold text-amber-600">{stats?.pendingApplications || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Approved Providers</span>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.approvedProviders || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Active Cargo Listings</span>
            <Boxes className="h-5 w-5 text-blue-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">{stats?.activeCargoSpace || 0}</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-slate-500 text-xs font-semibold uppercase">
            <span>Platform Revenue (5%)</span>
            <CreditCard className="h-5 w-5 text-purple-600" />
          </div>
          <span className="text-3xl font-extrabold text-slate-900">₹{(stats?.platformRevenue || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Booking Volume & Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Monthly Booking Volume & Platform Growth</h3>
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bookingVolumeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="bookings" fill="#2563eb" radius={[4, 4, 0, 0]} name="Total Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Routes Leaderboard */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-base">Top Cargo Routes</h3>
          <div className="space-y-3">
            {popularRoutes.length === 0 ? (
              <div className="text-slate-400 text-sm">No route data yet.</div>
            ) : (
              popularRoutes.map((r, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl text-sm font-semibold border border-slate-200">
                  <span className="text-slate-900">{r.route}</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {r.count} Bookings
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
