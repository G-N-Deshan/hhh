import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import StatCard from "../../components/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaUsers, FaBriefcase, FaExclamationTriangle, FaCheckCircle, FaShieldAlt, FaArrowRight } from "react-icons/fa";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#0284c7", "#8b5cf6", "#10b981", "#64748b"];

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [analyticsRes, barriersList] = await Promise.all([
          dataService.getAnalytics(),
          dataService.getBarriers(),
        ]);

        setData(analyticsRes);
        setRecentReports((barriersList || []).slice(0, 5));
      } catch (err) {
        console.error("Failed to load admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Calculating Faculty Admin Executive Metrics..." />;
  if (!data) return null;

  const { summary, categoryStats, urgencyStats } = data;

  const categoryChartData = (categoryStats || []).map((item) => ({
    name: item._id || "Other",
    Count: item.count,
  }));

  const urgencyChartData = (urgencyStats || []).map((item) => ({
    name: item._id || "Medium",
    value: item.count,
  }));

  return (
    <div className="space-y-8 py-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-700 uppercase tracking-widest mb-1">
            <FaShieldAlt />
            <span>Administrator Control Center & Executive Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
            Faculty Admin Control Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            System overview of opportunity engagement, barrier distribution, and resolution performance.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Link to="/admin/opportunities" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200">
            Manage Opps
          </Link>
          <Link to="/admin/barriers" className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200">
            Manage Barriers
          </Link>
          <Link to="/admin/users" className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200">
            Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Opps" value={summary.totalOpportunities} icon={<FaBriefcase />} color="amber" />
        <StatCard title="Active Opps" value={summary.openOpportunities} icon={<FaBriefcase />} color="emerald" />
        <StatCard title="Total Users" value={summary.totalUsers} icon={<FaUsers />} color="purple" />
        <StatCard title="Barrier Reports" value={summary.totalBarriers} icon={<FaExclamationTriangle />} color="rose" />
        <StatCard title="Pending Reports" value={summary.pendingBarriers} icon={<FaExclamationTriangle />} color="rose" />
        <StatCard title="Resolved Reports" value={summary.resolvedBarriers} icon={<FaCheckCircle />} color="emerald" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Barriers by Category Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Most Reported Barriers by Category</span>
          </h3>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", color: "#0f172a" }} />
                <Bar dataKey="Count" fill="#e11d48" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgency Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
          <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Barrier Urgency & Severity Distribution</span>
          </h3>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={urgencyChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {urgencyChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "8px", color: "#0f172a" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Barrier Reports Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 font-outfit">Recent Barrier Reports Table</h3>
          <Link to="/admin/barriers" className="text-xs font-semibold text-rose-700 hover:underline flex items-center space-x-1">
            <span>Manage All Reports</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-mono border-b border-slate-200">
              <tr>
                <th className="p-3">Report ID</th>
                <th className="p-3">Barrier Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentReports.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-slate-500">{b._id}</td>
                  <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{b.title}</td>
                  <td className="p-3 font-mono text-slate-700">{b.category}</td>
                  <td className="p-3 font-mono text-rose-700 font-bold">{b.severity || "Medium"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link to="/admin/barriers" className="text-xs text-blue-600 font-bold hover:underline">
                      Process →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
