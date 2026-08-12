import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

export default function ManageBarrierReports() {
  const [barriers, setBarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [activeReport, setActiveReport] = useState(null);
  const [statusInput, setStatusInput] = useState("Pending");
  const [adminResponseInput, setAdminResponseInput] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadBarriers = async () => {
    setLoading(true);
    try {
      const list = await dataService.getBarriers({
        status: selectedStatus,
        category: selectedCategory,
      });
      setBarriers(list || []);
    } catch (err) {
      toast.error("Failed to load barrier reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarriers();
  }, [selectedStatus, selectedCategory]);

  const handleOpenDrawer = (report) => {
    setActiveReport(report);
    setStatusInput(report.status || "Pending");
    setAdminResponseInput(report.adminResponse || report.resolutionNotes || "");
  };

  const handleSaveReport = async (e) => {
    e.preventDefault();
    if (!activeReport) return;

    setUpdating(true);
    try {
      const updated = await dataService.updateBarrierStatus(activeReport._id, {
        status: statusInput,
        adminResponse: adminResponseInput,
        resolutionNotes: adminResponseInput,
      });
      toast.success("Barrier report status & admin response updated!");
      setBarriers(barriers.map((b) => (b._id === activeReport._id ? updated : b)));
      setActiveReport(null);
    } catch (err) {
      toast.error("Failed to update barrier report");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Manage Barrier Reports</h1>
          <p className="text-xs text-slate-500">Review user-submitted accessibility barriers and update resolution progress.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "Pending", "Investigating", "Resolved", "Closed"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                selectedStatus === st
                  ? "bg-rose-600 text-white border-rose-600 font-bold"
                  : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <Loader text="Fetching barrier reports..." />
        ) : barriers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">No barrier reports match filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-4">Report ID</th>
                  <th className="p-4">Barrier Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reported By</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {barriers.map((b) => (
                  <tr key={b._id} className="hover:bg-slate-50">
                    <td className="p-4 font-mono text-slate-500">{b._id}</td>
                    <td className="p-4 font-bold text-slate-900 font-outfit max-w-xs truncate">{b.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                        {b.category}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-rose-600">{b.severity || b.urgency || "Medium"}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] border font-bold ${
                        b.status === "Resolved"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : b.status === "Investigating"
                          ? "bg-sky-50 text-sky-800 border-sky-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{b.isAnonymous ? "Anonymous" : b.reportedBy?.name || "Student"}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleOpenDrawer(b)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs"
                      >
                        Process Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Side Drawer / Modal */}
      {activeReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg h-full glass-panel p-6 border-l border-slate-200 bg-white overflow-y-auto space-y-6 animate-in slide-in-from-right duration-200 shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-rose-600" />
                <h2 className="text-lg font-bold text-slate-900 font-outfit">Barrier Report Details</h2>
              </div>
              <button onClick={() => setActiveReport(null)} className="p-2 text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p><span className="text-slate-500 font-mono">Report ID:</span> <span className="text-slate-800 font-mono">{activeReport._id}</span></p>
              <h3 className="text-xl font-bold text-slate-900 font-outfit">{activeReport.title}</h3>
              <p className="text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 leading-relaxed">
                {activeReport.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Category</span>
                <span className="text-slate-900">{activeReport.category}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Severity</span>
                <span className="text-rose-600 font-bold">{activeReport.severity || "Medium"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Reported By</span>
                <span className="text-slate-900">{activeReport.isAnonymous ? "Anonymous User" : activeReport.reportedBy?.name || "Student"}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Date Reported</span>
                <span className="text-slate-900">{new Date(activeReport.createdAt || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Form to Update Status & Admin Response */}
            <form onSubmit={handleSaveReport} className="space-y-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Update Status *
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs font-bold"
                >
                  <option value="Pending">Pending</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Admin Response / Resolution Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide admin status update or resolution response..."
                  value={adminResponseInput}
                  onChange={(e) => setAdminResponseInput(e.target.value)}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveReport(null)}
                  className="px-4 py-2 text-slate-500 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs font-outfit"
                >
                  {updating ? "Saving Response..." : "Save Admin Response"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
