import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaShieldAlt, FaLock, FaEnvelope, FaSignInAlt } from "react-icons/fa";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      const stored = localStorage.getItem("userInfo");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.role === "admin") {
          toast.success("Welcome to Administrator Control Panel");
          navigate("/admin/dashboard");
          return;
        }
      }
      toast.error("Access Denied: Regular user accounts cannot access the Admin Portal");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-rose-200 bg-white shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Top Crimson Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-rose-100/60 rounded-full blur-3xl pointer-events-none"></div>

        {/* Branding & Security Header */}
        <div className="text-center space-y-3 relative z-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <FaShieldAlt className="w-8 h-8 text-rose-500 animate-pulse" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200 inline-block mb-1">
              Restricted Portal
            </span>
            <h1 className="text-2xl font-black text-slate-900 font-outfit">Faculty Admin Security Login</h1>
            <p className="text-xs text-slate-500">Faculty of Technology • University of Ruhuna</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Administrator Email *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="email"
                required
                placeholder="admin@ruh.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Administrator Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-md transition-all font-outfit flex items-center justify-center space-x-2"
          >
            <FaSignInAlt />
            <span>{loading ? "Authenticating Admin..." : "Access Administrator Panel"}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-[11px] text-slate-500 font-mono">
          System Security Level: High • Authorized Admin Access Only
        </div>

      </div>
    </div>
  );
}
