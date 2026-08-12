import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaBookmark, FaRegBookmark, FaClock } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { dataService } from "../services/dataService";
import toast from "react-hot-toast";

export default function OpportunityCard({ opportunity, onSaveToggle }) {
  const { user } = useAuth();
  
  const targetId = opportunity._id || opportunity.id;
  const localSavedIds = JSON.parse(localStorage.getItem("local_wishlist") || "[]");
  const userSavedIds = (user?.savedOpportunities || []).map((o) => (o._id || o).toString());
  
  const isInitiallySaved =
    userSavedIds.includes(targetId?.toString()) || localSavedIds.includes(targetId?.toString());

  const [saved, setSaved] = useState(isInitiallySaved);

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

  const handleSaveClick = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to save opportunities to wishlist");
      return;
    }
    const newSavedState = !saved;
    setSaved(newSavedState);

    await dataService.toggleSaveOpportunity(targetId);

    if (onSaveToggle) {
      onSaveToggle(targetId);
    } else {
      toast.success(newSavedState ? "Saved to wishlist!" : "Removed from wishlist");
    }
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
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                saved ? "text-amber-600 bg-amber-50 border border-amber-200" : "text-slate-400 hover:text-slate-700"
              }`}
              title={saved ? "Saved in Wishlist" : "Save Opportunity"}
            >
              {saved ? <FaBookmark className="w-4 h-4 text-amber-500" /> : <FaRegBookmark className="w-4 h-4" />}
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
            <span>Deadline: {deadlineDate.toLocaleDateString()}</span>
          </span>
        </div>

        {/* Department Badge */}
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">
          {opportunity.description}
        </p>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">
          {opportunity.department}
        </span>
        <Link
          to={`/opportunities/${opportunity._id}`}
          className="font-bold text-blue-600 hover:text-blue-800 font-outfit"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
