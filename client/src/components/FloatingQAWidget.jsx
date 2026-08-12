import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaQuestionCircle } from "react-icons/fa";

export default function FloatingQAWidget() {
  const location = useLocation();

  // Hide floating widget if user is already on the /qa page or /admin pages
  if (location.pathname === "/qa" || location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-bounce hover:animate-none">
      <Link
        to="/qa"
        className="glass-panel py-3 px-5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 text-white font-extrabold text-xs shadow-2xl border border-blue-400/40 hover:border-blue-300 flex items-center space-x-2.5 transition-all transform hover:scale-105 cursor-pointer font-outfit"
        title="Community Q&A Board - Ask & Answer Questions"
      >
        <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-amber-300">
          <FaQuestionCircle className="text-sm" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-blue-200 uppercase tracking-widest font-mono">Community</span>
          <span className="text-xs text-white">Q&A Board</span>
        </div>
      </Link>
    </div>
  );
}
