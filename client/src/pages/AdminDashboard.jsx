import React, { useEffect, useState } from "react";
import { dataService } from "../services/dataService";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
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
import { FaChartPie, FaUsers, FaBriefcase, FaExclamationTriangle, FaCheckCircle, FaShieldAlt } from "react-icons/fa";

const PIE_COLORS = ["#ef4444", "#f59e0b", "#38bdf8", "#a855f7", "#10b981", "#64748b"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await dataService.getAnalytics();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Calculating Faculty of Technology analytics..." />;
  if (!data) return null;

  const { summary, categoryStats, urgencyStats, oppDepartmentStats } = data;

  const categoryChartData = (categoryStats || []).map((item) => ({
    name: item._id || "Other",
    Count: item.count,
  }));

  const urgencyChartData = (urgencyStats || []).map((item) => ({
    name: item._id || "Medium",
    value: item.count,
  }));

  const deptChartData = (oppDepartmentStats || []).map((item) => ({
    department: (item._id || "All").replace("Department of ", ""),
    Opportunities: item.count,
  }));

  const resolvedRate = summary.totalBarriers > 0
    ? Math.round((summary.resolvedBarriers / summary.totalBarriers) * 100)
    : 100;

  return (
    <div className="space-y-8 py-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-rose-900/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-rose-400 uppercase tracking-widest mb-1">
            <FaShieldAlt />
            <span>Administrator Control Center & Executive Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">
            Faculty Admin Control Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            System overview of opportunity engagement, barrier distribution, and resolution performance.
          </p>
        </div>

        <div className="px-4 py-2 bg-slate-950 rounded-xl border border-slate-800 text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Resolution Success</p>
          <p className="text-xl font-black text-emerald-400 font-outfit">{resolvedRate}% Resolved</p>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Users"
          value={summary.totalUsers}
          icon={<FaUsers />}
          color="purple"
          description="Students & Lecturers"
        />
        <StatCard
          title="Total Opportunities"
          value={summary.totalOpportunities}
          icon={<FaBriefcase />}
          color="amber"
          description={`${summary.openOpportunities} Currently Active`}
        />
        <StatCard
          title="Total Barriers"
          value={summary.totalBarriers}
          icon={<FaExclamationTriangle />}
          color="rose"
          description={`${summary.pendingBarriers} Pending Review`}
        />
        <StatCard
          title="Resolved Barriers"
          value={summary.resolvedBarriers}
          icon={<FaCheckCircle />}
          color="emerald"
          description={`${summary.inReviewBarriers} In Active Review`}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Barriers by Category Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>Access Barriers by Category</span>
          </h3>
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                />
                <Bar dataKey="Count" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Urgency Distribution Pie Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-white font-outfit flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Barrier Urgency Distribution</span>
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
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Charts Row 2 */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-lg font-bold text-white font-outfit flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-sky-500"></span>
          <span>Opportunities Distributed by Academic Department</span>
        </h3>
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={deptChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="department" stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "8px" }}
              />
              <Bar dataKey="Opportunities" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
