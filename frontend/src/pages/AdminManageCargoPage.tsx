import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { ICargoListing } from '../types';
import { Badge } from '../components/Badge';
import { Boxes, Trash2 } from 'lucide-react';

export const AdminManageCargoPage: React.FC = () => {
  const [cargoListings, setCargoListings] = useState<ICargoListing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await api.get('/cargo');
      if (res.data.success) {
        setCargoListings(res.data.cargoListings);
      }
    } catch (err) {
      console.error('Error fetching admin cargo listings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleCancelListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to cancel this container listing?')) return;
    try {
      const res = await api.delete(`/cargo/${listingId}`);
      if (res.data.success) {
        fetchListings();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to cancel listing.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <Boxes className="h-6 w-6 text-blue-600" />
          <span>Admin Container Cargo Space Manager</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Monitor all active and published container cargo listings across the marketplace
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading cargo space listings...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Route</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Container Info</th>
                  <th className="px-4 py-3">Available Space</th>
                  <th className="px-4 py-3">Rate / KG</th>
                  <th className="px-4 py-3">Departure Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cargoListings.map((c) => (
                  <tr key={c._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {c.origin} → {c.destination}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">{c.providerName}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {c.transportMode} • {c.containerType} ({c.containerNumber})
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      <strong className="block text-slate-900">{c.availableWeight} KG Available</strong>
                      {c.availableVolume} CBM Available
                    </td>
                    <td className="px-4 py-3.5 font-bold text-blue-700">₹{c.pricePerKg}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-600">
                      {new Date(c.departureDate).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3.5">
                      <Badge status={c.status} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {c.status === 'Available' && (
                        <button
                          onClick={() => handleCancelListing(c._id)}
                          className="p-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition"
                          title="Cancel Container Listing"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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
