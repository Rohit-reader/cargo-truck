import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { UserCheck, Check, X, ShieldAlert, FileText } from 'lucide-react';

export const ProviderApplicationsPage: React.FC = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/admin/providers');
      if (res.data.success) {
        setProviders(res.data.providers);
      }
    } catch (err) {
      console.error('Failed to load applications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async (providerId: string) => {
    setActioningId(providerId);
    try {
      const res = await api.post(`/admin/providers/${providerId}/approve`);
      if (res.data.success) {
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Approval failed.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (providerId: string) => {
    const reason = prompt('Please enter the reason for rejection:', 'Incomplete documentation');
    if (reason === null) return;

    setActioningId(providerId);
    try {
      const res = await api.post(`/admin/providers/${providerId}/reject`, { reason });
      if (res.data.success) {
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Rejection failed.');
    } finally {
      setActioningId(null);
    }
  };

  const handleSuspend = async (providerId: string) => {
    if (!confirm('Are you sure you want to suspend this provider? All their cargo listings will be cancelled.')) {
      return;
    }

    setActioningId(providerId);
    try {
      const res = await api.post(`/admin/providers/${providerId}/suspend`);
      if (res.data.success) {
        fetchApplications();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Suspension failed.');
    } finally {
      setActioningId(null);
    }
  };

  const renderStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'under review':
      case 'pending':
        return (
          <span className="inline-block bg-amber-50/80 border border-amber-300 text-amber-900 font-semibold px-4 py-2 rounded-full text-xs text-center shadow-2xs">
            Under Review
          </span>
        );
      case 'approved':
        return (
          <span className="inline-block bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold px-4 py-1.5 rounded-full text-xs text-center shadow-2xs">
            Approved
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block bg-rose-50 border border-rose-300 text-rose-800 font-semibold px-4 py-1.5 rounded-full text-xs text-center shadow-2xs">
            Rejected
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-block bg-slate-100 border border-slate-300 text-slate-800 font-semibold px-4 py-1.5 rounded-full text-xs text-center shadow-2xs">
            Suspended
          </span>
        );
      default:
        return (
          <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 font-semibold px-4 py-1.5 rounded-full text-xs">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <UserCheck className="h-6 w-6 text-blue-600" />
          <span>Logistics Provider Verification</span>
        </h1>
        <p className="text-slate-500 text-sm">
          Review business registration credentials and approve, reject, or suspend logistics provider accounts
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading provider applications...</div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto">
          No provider applications submitted yet.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700 border-collapse">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Company Name</th>
                  <th className="px-5 py-3.5">Contact Person</th>
                  <th className="px-5 py-3.5">Modes Offered</th>
                  <th className="px-5 py-3.5">Verification Documents</th>
                  <th className="px-5 py-3.5">Data Quality</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {providers.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-5 font-bold text-slate-900">
                      <div className="text-base font-extrabold text-slate-900">{p.companyName}</div>
                      <span className="text-xs font-semibold text-slate-400">{p.city}, {p.state}</span>
                    </td>
                    <td className="px-5 py-5">
                      <strong className="block text-slate-900 text-sm">{p.contactPerson}</strong>
                      <span className="text-xs text-slate-400 font-medium">{p.userEmail}</span>
                    </td>
                    <td className="px-5 py-5">
                      <div className="flex flex-wrap gap-1">
                        {p.transportModes.map((m: string) => (
                          <span key={m} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-5 text-xs text-slate-600">
                      {p.documents.length === 0 ? (
                        <span className="text-amber-700 font-semibold">No Documents Uploaded</span>
                      ) : (
                        <div className="space-y-1">
                          {p.documents.map((doc: any) => (
                            <div key={doc._id} className="flex items-center space-x-1.5 text-slate-700 font-medium">
                              <FileText className="h-3.5 w-3.5 text-blue-600" />
                              <span>{doc.documentType} ({doc.status})</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-5 font-extrabold text-blue-700 text-sm">{p.dataQualityScore}%</td>
                    <td className="px-5 py-5">
                      {renderStatusBadge(p.verificationStatus)}
                    </td>

                    {/* Action Buttons Column matching user's image spacing */}
                    <td className="px-5 py-5">
                      <div className="flex flex-col items-end gap-2.5">
                        {p.verificationStatus !== 'Approved' && (
                          <button
                            disabled={actioningId === p._id}
                            onClick={() => handleApprove(p._id)}
                            className="w-28 py-2 px-3.5 bg-[#2d6a4f] hover:bg-[#1b4332] text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center space-x-1.5 shadow-2xs"
                          >
                            <Check className="h-4 w-4 stroke-[3]" />
                            <span>Approve</span>
                          </button>
                        )}

                        {p.verificationStatus !== 'Rejected' && (
                          <button
                            disabled={actioningId === p._id}
                            onClick={() => handleReject(p._id)}
                            className="w-28 py-2 px-3.5 bg-rose-100/90 hover:bg-rose-200 text-[#800f2f] font-extrabold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                          >
                            <X className="h-4 w-4 stroke-[2.5]" />
                            <span>Reject</span>
                          </button>
                        )}

                        {p.verificationStatus === 'Approved' && (
                          <button
                            disabled={actioningId === p._id}
                            onClick={() => handleSuspend(p._id)}
                            className="w-28 py-2 px-3.5 bg-slate-100 hover:bg-slate-200 text-[#1e293b] border border-slate-200 font-extrabold rounded-xl text-xs transition flex items-center justify-center space-x-1.5"
                          >
                            <ShieldAlert className="h-4 w-4 text-slate-600" />
                            <span>Suspend</span>
                          </button>
                        )}
                      </div>
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
