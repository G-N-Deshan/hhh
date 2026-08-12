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
        className="py-3 px-5 rounded-full bg-gradient-to-r from-amber-500 via-rose-600 to-indigo-950 text-white font-extrabold text-xs shadow-2xl border-2 border-amber-300 shadow-amber-500/30 flex items-center space-x-2.5 transition-all transform hover:scale-105 cursor-pointer font-outfit"
        title="Community Q&A Board - Ask & Answer Questions"
      >
        <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md">
          <FaQuestionCircle className="text-base" />
        </div>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[10px] text-amber-200 uppercase tracking-widest font-mono font-bold">Community</span>
          <span className="text-xs font-black text-white">Q&A Board</span>
        </div>
      </Link>
    </div>
  );
}

