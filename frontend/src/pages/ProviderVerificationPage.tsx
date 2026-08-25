import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { IProviderProfile } from '../types';
import { Badge } from '../components/Badge';
import { ShieldCheck, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProviderVerificationPage: React.FC = () => {
  const [profile, setProfile] = useState<IProviderProfile | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [documentType, setDocumentType] = useState('Business Registration');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchVerificationInfo = async () => {
    try {
      const res = await api.get('/providers/profile');
      if (res.data.success) {
        setProfile(res.data.provider);
        setDocuments(res.data.documents);
      }
    } catch (err) {
      console.error('Error fetching verification details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerificationInfo();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    setError('');
    setMessage('');
    setUploading(true);

    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('document', file);

    try {
      const res = await api.post('/providers/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setMessage(`Document '${documentType}' uploaded successfully.`);
        setFile(null);
        fetchVerificationInfo();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Document upload failed.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400 font-semibold">Loading verification details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
            <span>Provider Verification & Documents</span>
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Submit required credentials to achieve Verified Logistics Provider status
          </p>
        </div>
        <Badge status={profile?.verificationStatus || 'Pending'} />
      </div>

      {/* Verification Status Explanation Card */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-2 text-sm">
        <h3 className="font-bold text-slate-900 flex items-center space-x-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          <span>Verification Process Information</span>
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Sutrivazhi requires all logistics service providers to maintain valid business registration and transport licenses.
          Once uploaded, our Admin team will review your application within 24 hours.
        </p>
      </div>

      {/* Upload Document Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
          <Upload className="h-5 w-5 text-blue-600" />
          <span>Upload Verification Document</span>
        </h3>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Document Type *</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm bg-white"
              >
                <option value="Business Registration">Business Registration</option>
                <option value="GST Certificate">GST Certificate</option>
                <option value="PAN">PAN Card</option>
                <option value="Transport License">Transport License</option>
                <option value="Address Proof">Address Proof</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Select File (PDF, PNG, JPG) *</label>
              <input
                type="file"
                required
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm rounded-xl shadow-sm transition"
          >
            {uploading ? 'Uploading Document...' : 'Submit Document'}
          </button>
        </form>
      </div>

      {/* Uploaded Documents List */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base">Uploaded Documents</h3>

        {documents.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-sm">No verification documents uploaded yet.</div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-sm">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <div>
                    <strong className="text-slate-900 block">{doc.documentType}</strong>
                    <span className="text-xs text-slate-400">{doc.originalName}</span>
                  </div>
                </div>
                <Badge status={doc.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
