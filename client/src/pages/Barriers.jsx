import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dataService } from "../services/dataService";
import BarrierCard from "../components/BarrierCard";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { FaExclamationTriangle, FaPlusCircle, FaFilter, FaTimes } from "react-icons/fa";

const STATUS_TABS = ["All", "Pending", "In Review", "Resolved"];
const CATEGORIES = [
  "All",
  "Infrastructure",
  "Equipment & Hardware",
  "Software & Network Access",
  "Mentorship & Academic Guidance",
  "Financial & Grants",
  "Other",
];

export default function Barriers() {
  const { user } = useAuth();
  const [barriers, setBarriers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Equipment & Hardware");
  const [newDepartment, setNewDepartment] = useState(
    user?.department || "Department of Information & Communication Technology"
  );
  const [newUrgency, setNewUrgency] = useState("Medium");

  const loadBarriers = async () => {
    setLoading(true);
    try {
      const data = await dataService.getBarriers({
        status: selectedStatus,
        category: selectedCategory,
      });
      setBarriers(data || []);
    } catch (err) {
      toast.error("Failed to load barrier reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarriers();
  }, [selectedStatus, selectedCategory]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to submit a barrier report");
      return;
    }

    setSubmitting(true);
    try {
      const data = await dataService.createBarrier({
        title: newTitle,
        description: newDescription,
        category: newCategory,
        department: newDepartment,
        urgency: newUrgency,
      });

      toast.success("Barrier report submitted successfully!");
      setBarriers([data, ...barriers]);
      setModalOpen(false);
      setNewTitle("");
      setNewDescription("");
    } catch (err) {
      toast.error("Failed to submit barrier report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, updatePayload) => {
    try {
      const data = await dataService.updateBarrierStatus(id, updatePayload);
      toast.success("Barrier status updated successfully");
      setBarriers(barriers.map((b) => (b._id === id ? data : b)));
    } catch (err) {
      toast.error("Update status failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this barrier report?")) return;
    try {
      await dataService.deleteBarrier(id);
      toast.success("Report deleted");
      setBarriers(barriers.filter((b) => b._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
            <FaExclamationTriangle />
            <span>Barrier Resolution Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">
            Report & Track Access Barriers
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Report equipment shortages, software license issues, or academic access barriers directly to faculty administrators.
          </p>
        </div>

        <button
          onClick={() => {
            if (!user) {
              toast.error("Please sign in to submit a barrier report");
              return;
            }
            setModalOpen(true);
          }}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-sm transition-all shadow-lg shadow-rose-950/40 flex items-center space-x-2 shrink-0 font-outfit"
        >
          <FaPlusCircle />
          <span>Report Access Barrier</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`text-xs font-semibold px-4 py-2 rounded-xl border transition-all ${
                selectedStatus === tab
                  ? "bg-rose-950 text-rose-300 border-rose-700 font-bold shadow-md shadow-rose-950/30"
                  : "bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800"
              }`}
            >
              {tab} Reports
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="flex items-center space-x-2">
          <FaFilter className="text-amber-400 text-xs" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-slate-800 focus:border-rose-500 focus:outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Barrier Cards */}
      {loading ? (
        <Loader text="Fetching faculty access barrier reports..." />
      ) : barriers.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border border-slate-800 text-slate-400 space-y-2">
          <p className="text-lg font-bold text-slate-300">No barrier reports match this filter.</p>
          <p className="text-sm">Submit a new report to notify faculty administration of active equipment or access gaps.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barriers.map((b) => (
            <BarrierCard
              key={b._id}
              barrier={b}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Create Barrier Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-6 rounded-3xl border border-slate-800 space-y-5 relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FaExclamationTriangle className="text-rose-400 text-lg" />
                <h2 className="text-xl font-bold text-white font-outfit">Report Access Barrier</h2>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Issue Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken Oscilloscope Power Cable in Robotics Lab"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none text-xs"
                  >
                    <option value="Equipment & Hardware">Equipment & Hardware</option>
                    <option value="Software & Network Access">Software & Network Access</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Mentorship & Academic Guidance">Mentorship & Academic Guidance</option>
                    <option value="Financial & Grants">Financial & Grants</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={newUrgency}
                    onChange={(e) => setNewUrgency(e.target.value)}
                    className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none text-xs"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={newDepartment}
                  onChange={(e) => setNewDepartment(e.target.value)}
                  className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none text-xs"
                >
                  <option value="Department of Information & Communication Technology">
                    Department of Information & Communication Technology
                  </option>
                  <option value="Department of Engineering Technology">
                    Department of Engineering Technology
                  </option>
                  <option value="Department of Biosystems Technology">
                    Department of Biosystems Technology
                  </option>
                  <option value="Faculty Wide">Faculty Wide</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Description & Impact *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Explain how this barrier impacts your academic progress or laboratory work..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 text-white px-4 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:outline-none text-sm"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-950/40"
                >
                  {submitting ? "Submitting..." : "Submit Barrier Report"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
