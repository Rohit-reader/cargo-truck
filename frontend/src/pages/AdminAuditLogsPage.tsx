import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IAuditLog } from '../types';
import { FileSpreadsheet, Shield } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<IAuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get('/admin/audit-logs');
        if (res.data.success) {
          setLogs(res.data.logs);
        }
      } catch (err) {
        console.error('Failed to fetch audit logs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
          <FileSpreadsheet className="h-6 w-6 text-blue-600" />
          <span>Security & System Audit Trail</span>
        </h1>
        <p className="text-slate-500 text-sm">
          System audit logs tracking provider registrations, document verifications, booking creations, and administrative actions
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 font-semibold">Loading audit trail...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">User Role</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Resource</th>
                  <th className="px-4 py-3">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50 transition">
                    <td className="px-4 py-3 text-xs text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-bold text-[11px] uppercase">
                        {log.userRole || 'System'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-blue-700">{log.action}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{log.targetResource}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">{log.details}</td>
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
