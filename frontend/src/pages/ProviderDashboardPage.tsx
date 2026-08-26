import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CapacityProgressBar } from '../components/CapacityProgressBar';
import { FillMyContainerModal } from '../components/FillMyContainerModal';
import { LayoutDashboard, Boxes, PackageCheck, Zap, ShieldAlert, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const ProviderDashboardPage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [optimizingListing, setOptimizingListing] = useState<any | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, listingsRes] = await Promise.all([
          api.get('/providers/me'),
          api.get('/providers/listings'),
        ]);

        if (profileRes.data.success) setProfile(profileRes.data.profile);
        if (listingsRes.data.success) setListings(listingsRes.data.listings);
      } catch (err) {
        console.error('Failed to load provider dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-slate-400 font-semibold">Loading Provider Portal...</div>;
  }

  // Calculate stats & chart data
  const totalCapacityKg = listings.reduce((acc, l) => acc + l.totalWeightCapacity, 0);
  const availableCapacityKg = listings.reduce((acc, l) => acc + l.availableWeight, 0);
  const bookedCapacityKg = totalCapacityKg - availableCapacityKg;
  const overallUtilPct = totalCapacityKg > 0 ? Math.round((bookedCapacityKg / totalCapacityKg) * 100) : 0;

  const chartData = listings.map((l) => {
    const booked = l.totalWeightCapacity - l.availableWeight;
    return {
      container: l.containerNumber.split('-')[0] || l.containerNumber,
      BookedKG: booked,
      AvailableKG: l.availableWeight,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Verification Alert Banner */}
      {profile?.verificationStatus !== 'Approved' && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="font-extrabold text-amber-900 text-sm">Account Verification Under Review</h3>
              <p className="text-xs text-amber-700">
                Please upload required business registration documents to publish cargo space on Sutrivazhi.
              </p>
            </div>
          </div>
          <Link
            to="/provider/verification"
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs whitespace-nowrap shadow-xs"
          >
            Upload Documents
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center space-x-2">
            <LayoutDashboard className="h-7 w-7 text-blue-600" />
            <span>Logistics Provider Portal</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {profile?.companyName || 'Verified Logistics Provider'} • Data Quality Rating: {profile?.dataQualityScore || 94}%
          </p>
        </div>

        <Link
          to="/provider/cargo-space"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition flex items-center space-x-2 shadow-xs self-start md:self-auto"
        >
          <Boxes className="h-4 w-4" />
          <span>Manage Container Listings</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Total Active Containers</span>
          <span className="block text-3xl font-black text-slate-900">{listings.length}</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Overall Capacity Fill Rate</span>
          <span className="block text-3xl font-black text-blue-600">{overallUtilPct}%</span>
          <span className="text-xs text-slate-500 font-medium">Across active container fleet</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Booked Capacity</span>
          <span className="block text-3xl font-black text-emerald-600">{bookedCapacityKg.toLocaleString()} KG</span>
          <span className="text-xs text-slate-500 font-medium">Secured cargo consignments</span>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <span className="text-xs font-bold uppercase text-slate-400">Unused Available Space</span>
          <span className="block text-3xl font-black text-amber-600">{availableCapacityKg.toLocaleString()} KG</span>
          <span className="text-xs text-slate-500 font-medium">Ready for optimization</span>
        </div>
      </div>

      {/* Utilization Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Container Capacity Utilization Bar Chart</h2>

        <div className="h-64 w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-medium text-sm">
              No container capacity data to chart.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="container" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="BookedKG" fill="#2563eb" name="Booked KG" radius={[4, 4, 0, 0]} />
                <Bar dataKey="AvailableKG" fill="#cbd5e1" name="Available KG" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Active Listings with ⚡ Fill My Container Action */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Active Container Capacity</h2>
          <Link to="/provider/cargo-space" className="text-xs font-bold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {listings.map((l) => (
            <div key={l._id} className="p-4 border border-slate-200 rounded-2xl space-y-3 bg-slate-50/50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {l.origin} → {l.destination} ({l.transportMode})
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">Container {l.containerNumber}</span>
                </div>

                <button
                  onClick={() => setOptimizingListing(l)}
                  className="px-3 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-extrabold rounded-xl text-xs transition flex items-center space-x-1.5 shadow-2xs"
                >
                  <Zap className="h-3.5 w-3.5 text-yellow-400 fill-current" />
                  <span>⚡ Fill My Container</span>
                </button>
              </div>

              <CapacityProgressBar
                total={l.totalWeightCapacity}
                available={l.availableWeight}
                unit="KG"
                label="Weight Space"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Fill My Container Optimization Modal */}
      {optimizingListing && (
        <FillMyContainerModal
          listing={optimizingListing}
          isOpen={!!optimizingListing}
          onClose={() => setOptimizingListing(null)}
        />
      )}
    </div>
  );
};
