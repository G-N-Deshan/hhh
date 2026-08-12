import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import { FaPlusCircle, FaEdit, FaTrash, FaEye, FaDownload } from "react-icons/fa";

export default function ManageOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  const loadOpps = async () => {
    setLoading(true);
    try {
      const list = await dataService.getOpportunities({ keyword });
      setOpportunities(list || []);
    } catch (err) {
      toast.error("Failed to load opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpps();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await dataService.deleteOpportunity(id);
      toast.success("Opportunity removed");
      setOpportunities(opportunities.filter((o) => o._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Title", "Category", "Department", "Deadline", "Location", "Status"];
    const rows = opportunities.map((o) => [
      `"${o.title}"`,
      `"${o.category}"`,
      `"${o.department}"`,
      `"${new Date(o.deadline).toLocaleDateString()}"`,
      `"${o.location}"`,
      `"${o.status}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "opportunities_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 py-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-200 bg-white">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Manage Opportunities</h1>
          <p className="text-xs text-slate-500">Add, edit, review, or remove faculty opportunities.</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1.5 border border-slate-200"
          >
            <FaDownload />
            <span>Export CSV</span>
          </button>

          <Link
            to="/opportunities/create"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 font-outfit shadow-sm"
          >
            <FaPlusCircle />
            <span>Add Opportunity</span>
          </Link>
        </div>
      </div>

      {/* Table Container */}
      <div className="glass-panel rounded-2xl border border-slate-200 bg-white overflow-hidden">
        {loading ? (
          <Loader text="Loading opportunities..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Deadline</th>
                  <th className="p-4">Views</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {opportunities.map((opp) => (
                  <tr key={opp._id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900 font-outfit">{opp.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                        {opp.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded font-mono ${
                        opp.status === "Open" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-slate-100 text-slate-600"
                      }`}>
                        {opp.status}
                      </span>
                    </td>
                    <td className="p-4 font-mono">{new Date(opp.deadline).toLocaleDateString()}</td>
                    <td className="p-4 font-mono">{opp.views || 0}</td>
                    <td className="p-4 text-right space-x-2">
                      <Link
                        to={`/opportunities/${opp._id}`}
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-blue-600 inline-block"
                        title="View"
                      >
                        <FaEye />
                      </Link>
                      <Link
                        to={`/opportunities/edit/${opp._id}`}
                        className="p-2 rounded bg-slate-100 hover:bg-slate-200 text-amber-600 inline-block"
                        title="Edit"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(opp._id)}
                        className="p-2 rounded bg-rose-50 hover:bg-rose-100 text-rose-600 inline-block border border-rose-200"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
