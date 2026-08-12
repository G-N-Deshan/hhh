import React, { useState } from "react";
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaSyncAlt, FaBuilding, FaUser, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function BarrierCard({ barrier, onStatusUpdate, onDelete }) {
  const { user, isProvider, isAdmin } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [showNotesForm, setShowNotesForm] = useState(false);
  const [status, setStatus] = useState(barrier.status);
  const [resolutionNotes, setResolutionNotes] = useState(barrier.resolutionNotes || "");

  const canManage = isProvider || isAdmin;
  const canDelete = isAdmin || (user && barrier.reportedBy?._id === user._id);

  const getUrgencyBadge = (urgency) => {
    switch (urgency) {
      case "Critical":
        return "bg-rose-950/90 text-rose-300 border-rose-700 animate-pulse";
      case "High":
        return "bg-amber-950/90 text-amber-300 border-amber-700";
      case "Medium":
        return "bg-sky-950/90 text-sky-300 border-sky-700";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  const getStatusPill = (st) => {
    switch (st) {
      case "Resolved":
        return {
          icon: <FaCheckCircle className="text-emerald-400" />,
          label: "Resolved",
          badge: "bg-emerald-950/60 text-emerald-300 border-emerald-800/80",
        };
      case "In Review":
        return {
          icon: <FaSyncAlt className="text-amber-400 animate-spin" />,
          label: "In Review",
          badge: "bg-amber-950/60 text-amber-300 border-amber-800/80",
        };
      default:
        return {
          icon: <FaClock className="text-slate-400" />,
          label: "Pending",
          badge: "bg-slate-900 text-slate-300 border-slate-800",
        };
    }
  };

  const statusInfo = getStatusPill(barrier.status);

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    setUpdating(true);
    await onStatusUpdate(barrier._id, { status, resolutionNotes });
    setUpdating(false);
    setShowNotesForm(false);
  };

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 relative border border-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${getUrgencyBadge(
              barrier.urgency
            )}`}
          >
            {barrier.urgency} Urgency
          </span>
          <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-900 text-slate-400 border border-slate-800 font-mono">
            {barrier.category}
          </span>
        </div>

        <div className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${statusInfo.badge}`}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 font-outfit">{barrier.title}</h3>

      <p className="text-slate-300 text-sm leading-relaxed mb-4">{barrier.description}</p>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-4 pt-3 border-t border-slate-800/60 font-mono">
        <span className="flex items-center space-x-1">
          <FaBuilding className="text-amber-500" />
          <span>{barrier.department}</span>
        </span>
        <span className="flex items-center space-x-1">
          <FaUser className="text-slate-500" />
          <span>Reported by {barrier.reportedBy?.name || "Student"}</span>
        </span>
      </div>

      {barrier.resolutionNotes && (
        <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-xs text-emerald-300 mb-4">
          <span className="font-bold text-emerald-400 block mb-1">Resolution Update:</span>
          {barrier.resolutionNotes}
        </div>
      )}

      {/* Admin/Provider Status Update Toggle */}
      {canManage && (
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          {!showNotesForm ? (
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowNotesForm(true)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
              >
                Update Status / Resolution Notes
              </button>

              {canDelete && (
                <button
                  onClick={() => onDelete(barrier._id)}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-950/60 border border-rose-900/50"
                  title="Delete Report"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveStatus} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full text-xs bg-slate-900 text-white p-2 rounded-lg border border-slate-800"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Review">In Review</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Resolution / Action Notes</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Provide resolution details..."
                  className="w-full text-xs bg-slate-900 text-white p-2 rounded-lg border border-slate-800"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNotesForm(false)}
                  className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-3 py-1 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg"
                >
                  {updating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
