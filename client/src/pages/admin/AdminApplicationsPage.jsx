import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import {
  FaPaperPlane,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaTimesCircle,
  FaCheckCircle,
  FaHourglassHalf,
  FaUser,
} from "react-icons/fa";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Edit Modal State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState("Submitted");
  const [newAdminNotes, setNewAdminNotes] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await dataService.getAllApplications();
      setApplications(data || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleOpenEditModal = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || "Submitted");
    setNewAdminNotes(app.adminNotes || "");
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    const res = await dataService.updateApplicationStatus(selectedApp._id, {
      status: newStatus,
      adminNotes: newAdminNotes,
    });
    setUpdating(false);

    if (res) {
      toast.success("Application status updated!");
      setSelectedApp(null);
      fetchApplications();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application record?")) {
      await dataService.deleteApplication(id);
      toast.success("Application deleted");
      fetchApplications();
    }
  };

  const filteredApps = applications.filter((app) => {
    if (statusFilter !== "All" && app.status !== statusFilter) return false;
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (app.applicantName || "").toLowerCase().includes(query) ||
      (app.applicantEmail || "").toLowerCase().includes(query) ||
      (app.opportunityTitle || app.opportunity?.title || "").toLowerCase().includes(query) ||
      (app.studentId || "").toLowerCase().includes(query)
    );
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted":
      case "Shortlisted":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Under Review":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  if (loading) return <Loader text="Loading submitted applications..." />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
            <FaPaperPlane className="text-blue-600" />
            <span>Manage Submitted Applications</span>
          </h1>
          <p className="text-xs text-slate-500">
            Review applicant details, update application status, and write response notes for students.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold font-mono">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
            Total: {applications.length}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by student name, email, or job..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["All", "Submitted", "Under Review", "Shortlisted", "Accepted", "Rejected"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Applications Grid / Table */}
      {filteredApps.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <FaPaperPlane className="text-slate-300 text-3xl mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-outfit">No Applications Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your status filter or search keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredApps.map((app) => (
            <div
              key={app._id}
              className="glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-outfit">
                      {app.opportunityTitle || app.opportunity?.title || "Faculty Opportunity"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Applied: {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusBadgeClass(app.status)} shrink-0`}>
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Applicant Name</span>
                    <span className="font-bold text-slate-900 flex items-center space-x-1">
                      <FaUser className="text-blue-500 text-[10px]" />
                      <span>{app.applicantName}</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Email Address</span>
                    <span className="font-bold text-slate-800 font-mono truncate block">{app.applicantEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase font-mono">Student ID / Reg</span>
                    <span className="font-bold text-slate-800 font-mono">{app.studentId || "N/A"}</span>
                  </div>
                </div>

                {app.coverNote && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block">Cover Note</span>
                    <p className="italic text-xs">"{app.coverNote}"</p>
                  </div>
                )}

                {app.adminNotes && (
                  <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-900 border border-blue-200 space-y-1">
                    <span className="text-[10px] font-bold text-blue-950 uppercase font-mono block">Admin Resolution Notes</span>
                    <p>{app.adminNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEditModal(app)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center space-x-1.5 cursor-pointer font-outfit"
                >
                  <FaEdit />
                  <span>Update Status</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(app._id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs cursor-pointer"
                  title="Delete Application"
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* UPDATE STATUS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit flex items-center space-x-2">
                <FaEdit className="text-blue-600" />
                <span>Update Application Status</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Applicant</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName} ({selectedApp.applicantEmail})</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Application Status *
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Admin Resolution Notes / Response to Student
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Forwarded application to Virtusa HR. Interview scheduled for Friday..."
                  value={newAdminNotes}
                  onChange={(e) => setNewAdminNotes(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:bg-white focus:border-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold font-outfit cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-outfit shadow-md cursor-pointer"
                >
                  {updating ? "Saving..." : "Save Status"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
