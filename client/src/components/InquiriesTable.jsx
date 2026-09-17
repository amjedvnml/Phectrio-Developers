import React, { useState } from 'react';
import { Search, Mail, Eye, Trash2, CheckCircle2, Clock, Check, X, AlertTriangle, Filter } from 'lucide-react';
import { updateInquiryStatus, deleteInquiry } from '../services/api';

const statusOptions = ['New', 'In Progress', 'Completed', 'Archived'];

export const InquiriesTable = ({ inquiries, onRefresh, loading }) => {
  const [activeStatusFilter, setActiveStatusFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingMessageInquiry, setViewingMessageInquiry] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmInquiry, setDeleteConfirmInquiry] = useState(null);

  // Status badge styling helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'New':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30';
      case 'In Progress':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      case 'Completed':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
      case 'Archived':
        return 'bg-slate-500/15 text-slate-400 border-slate-500/30';
      default:
        return 'bg-white/10 text-slate-300 border-white/15';
    }
  };

  const handleStatusChange = async (inquiryId, newStatus) => {
    try {
      setUpdatingId(inquiryId);
      await updateInquiryStatus(inquiryId, newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to update inquiry status:', err);
      alert('Failed to update status. Please check backend connection.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (inquiryId) => {
    try {
      setDeletingId(inquiryId);
      await deleteInquiry(inquiryId);
      setDeleteConfirmInquiry(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to delete inquiry:', err);
      alert('Failed to delete inquiry.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter inquiries
  const filteredList = inquiries.filter((inq) => {
    const matchesStatus = activeStatusFilter === 'All' || inq.status === activeStatusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.name.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      inq.service.toLowerCase().includes(q) ||
      inq.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
      
      {/* Table Controls Toolbar */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-[#090A11] p-1.5 rounded-2xl border border-white/5">
          {['All', ...statusOptions].map((st) => (
            <button
              key={st}
              onClick={() => setActiveStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                activeStatusFilter === st
                  ? 'bg-electric-violet text-white shadow-glow-subtle'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search leads, email, brief..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-electric-cyan transition-colors"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02] text-slate-400 font-mono uppercase tracking-wider text-[11px]">
              <th className="py-4 px-6">Client / Organization</th>
              <th className="py-4 px-6">Requested Discipline</th>
              <th className="py-4 px-6">Budget Tier</th>
              <th className="py-4 px-6">Date Queued</th>
              <th className="py-4 px-6">CRM Pipeline Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-slate-400 font-mono">
                  <div className="inline-block w-6 h-6 border-2 border-electric-cyan border-t-transparent rounded-full animate-spin mb-2" />
                  <div>Synchronizing CRM pipeline leads...</div>
                </td>
              </tr>
            ) : filteredList.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-slate-400">
                  No inquiries matched the active filters.
                </td>
              </tr>
            ) : (
              filteredList.map((inq) => {
                const isUpdating = updatingId === (inq._id || inq.id);
                return (
                  <tr
                    key={inq._id || inq.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Client Name & Email */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white text-sm mb-0.5">
                        {inq.name}
                      </div>
                      <a
                        href={`mailto:${inq.email}`}
                        className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono text-[11px]"
                      >
                        <Mail className="w-3 h-3" />
                        <span>{inq.email}</span>
                      </a>
                    </td>

                    {/* Service */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-slate-300">
                        {inq.service}
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-6">
                      <span className="font-mono text-purple-300 font-semibold bg-purple-950/40 px-2.5 py-1 rounded-lg border border-purple-800/30">
                        {inq.budget}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 font-mono text-slate-400">
                      {new Date(inq.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>

                    {/* Status Select Dropdown */}
                    <td className="py-4 px-6">
                      <div className="relative inline-block">
                        <select
                          disabled={isUpdating}
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq._id || inq.id, e.target.value)}
                          className={`appearance-none px-3 py-1 pr-7 rounded-lg text-xs font-mono font-medium border cursor-pointer focus:outline-none ${getStatusBadge(inq.status)} disabled:opacity-50`}
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt} value={opt} className="bg-[#0D0E15] text-white">
                              {opt}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">
                          ▼
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        {/* View Message Modal */}
                        <button
                          onClick={() => setViewingMessageInquiry(inq)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors border border-white/5"
                          title="View Message Brief"
                        >
                          <Eye className="w-3.5 h-3.5 text-electric-cyan" />
                        </button>

                        {/* Delete Inquire */}
                        <button
                          onClick={() => setDeleteConfirmInquiry(inq)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors border border-white/5"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Message Brief Modal */}
      {viewingMessageInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#0F101A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <button
              onClick={() => setViewingMessageInquiry(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-electric-violet/20 text-electric-violet border border-purple-500/30">
                {viewingMessageInquiry.service}
              </span>
              <h3 className="text-xl font-display font-bold text-white mt-2">
                {viewingMessageInquiry.name}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                Email: <span className="text-slate-200">{viewingMessageInquiry.email}</span> &bull; Budget: <span className="text-purple-300">{viewingMessageInquiry.budget}</span>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-slate-200 text-xs sm:text-sm leading-relaxed mb-6 max-h-60 overflow-y-auto whitespace-pre-wrap">
              {viewingMessageInquiry.message}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5">
              <span className="text-[11px] font-mono text-slate-500">
                Received on {new Date(viewingMessageInquiry.createdAt).toLocaleString()}
              </span>
              <a
                href={`mailto:${viewingMessageInquiry.email}?subject=Re:%20Nexios%20Developers%20Project%20Inquiry%20(${viewingMessageInquiry.service})`}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-electric-violet to-electric-cyan text-white text-xs font-semibold flex items-center gap-1.5 shadow-glow-subtle"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply to Client</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm bg-[#0F101A] border border-red-500/30 rounded-3xl p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-display font-bold text-white mb-2">
              Delete Lead Record?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Are you sure you want to delete the inquiry from <strong className="text-white">{deleteConfirmInquiry.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmInquiry(null)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmInquiry._id || deleteConfirmInquiry.id)}
                disabled={deletingId === (deleteConfirmInquiry._id || deleteConfirmInquiry.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold disabled:opacity-50"
              >
                {deletingId ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
