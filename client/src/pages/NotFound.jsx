import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center py-12 px-4 space-y-6">
      <div className="w-20 h-20 rounded-3xl bg-rose-950/80 border border-rose-800 text-rose-400 flex items-center justify-center text-4xl shadow-xl animate-bounce">
        <FaGraduationCap />
      </div>

      <h1 className="text-6xl font-black text-white font-outfit">404</h1>

      <p className="text-xl font-bold text-slate-300 max-w-md">
        Page Not Found
      </p>

      <p className="text-slate-400 text-sm max-w-md">
        The requested page does not exist on the OpportunityBridge Faculty platform.
      </p>

      <Link
        to="/"
        className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all flex items-center space-x-2 shadow-lg shadow-amber-500/20 font-outfit"
      >
        <FaHome />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
}
