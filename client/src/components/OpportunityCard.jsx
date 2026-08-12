import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaExclamationTriangle, FaExternalLinkAlt, FaClock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function OpportunityCard({ opportunity, onSaveToggle }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(
    user?.savedOpportunities?.some((o) => (o._id || o) === opportunity._id) || false
  );

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "Scholarships":
      case "Scholarship":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Internships":
      case "Internship":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Jobs":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Training":
      case "Workshop":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Financial Support":
        return "bg-teal-50 text-teal-700 border-teal-200";
      case "Mental Health":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-blue-50 text-blue-700 border-blue-200";
    }
  };

  const deadlineDate = new Date(opportunity.deadline);
  const now = new Date();
  const daysLeft = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  const isClosingSoon = daysLeft > 0 && daysLeft <= 7;
  const isExpired = daysLeft < 0;

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save opportunities");
      return;
    }
    setSaved(!saved);
    if (onSaveToggle) onSaveToggle(opportunity._id);
  };

  return (
    <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group relative border border-slate-200">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${getCategoryBadgeClass(
              opportunity.category
            )}`}
          >
            {opportunity.category}
          </span>

          <div className="flex items-center space-x-2">
            {isClosingSoon && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center space-x-1 animate-pulse">
                <FaClock />
                <span>Closing Soon</span>
              </span>
            )}
            {isExpired && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                Expired
              </span>
            )}

            <button
              onClick={handleSaveClick}
              className={`p-1.5 rounded-lg transition-colors ${
                saved ? "text-amber-600 bg-amber-50 border border-amber-200" : "text-slate-400 hover:text-slate-700"
              }`}
              title={saved ? "Saved" : "Save Opportunity"}
            >
              {saved ? <FaBookmark className="w-4 h-4" /> : <FaRegBookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-outfit line-clamp-2 mb-2">
          <Link to={`/opportunities/${opportunity._id}`}>{opportunity.title}</Link>
        </h3>

        {/* Location & Deadline Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-mono mb-3">
          <span className="flex items-center space-x-1">
            <FaMapMarkerAlt className="text-rose-500" />
            <span>{opportunity.location || "Faculty Campus"}</span>
          </span>
          <span className="flex items-center space-x-1">
            <FaCalendarAlt className="text-blue-500" />
            <span>{deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </span>
        </div>

        {/* Short Description */}
        <p className="text-slate-600 text-xs leading-relaxed line-clamp-3 mb-4">
          {opportunity.description}
        </p>
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/report-barrier?opportunityId=${opportunity._id}`}
          className="text-xs text-slate-500 hover:text-rose-600 transition-colors flex items-center space-x-1"
          title="Report a barrier accessing this opportunity"
        >
          <FaExclamationTriangle className="text-rose-500 text-[10px]" />
          <span>Report Barrier</span>
        </Link>

        <Link
          to={`/opportunities/${opportunity._id}`}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm flex items-center space-x-1 font-outfit"
        >
          <span>View Details</span>
          <FaExternalLinkAlt className="text-[10px]" />
        </Link>
      </div>
    </div>
  );
}
