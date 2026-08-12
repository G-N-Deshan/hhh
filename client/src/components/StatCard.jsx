import React from "react";

export default function StatCard({ title, value, icon, color = "blue", description }) {
  const getColorStyles = () => {
    switch (color) {
      case "amber":
        return "bg-amber-50 border-amber-200 text-amber-700";
      case "emerald":
        return "bg-emerald-50 border-emerald-200 text-emerald-700";
      case "purple":
        return "bg-purple-50 border-purple-200 text-purple-700";
      case "rose":
        return "bg-rose-50 border-rose-200 text-rose-700";
      default:
        return "bg-blue-50 border-blue-200 text-blue-700";
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-200 flex items-center justify-between">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 font-outfit">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-900 font-outfit mt-1">{value}</h3>
        {description && <p className="text-[11px] text-slate-500 font-mono mt-0.5">{description}</p>}
      </div>

      <div className={`p-3.5 rounded-2xl border text-xl ${getColorStyles()}`}>
        {icon}
      </div>
    </div>
  );
}
