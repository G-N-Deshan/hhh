import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaGraduationCap,
  FaHome,
  FaCompass,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaInfoCircle,
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaHeart,
} from "react-icons/fa";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo / Project Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
                <FaGraduationCap className="w-6 h-6 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 font-outfit">
                  Opportunity<span className="text-amber-600">Bridge</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-widest hidden lg:inline-block">
                  FoT Ruhuna
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium tracking-wide hidden sm:block">
                Connecting Opportunities • Overcoming Access Barriers
              </p>
            </div>
          </Link>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <FaHome className="text-xs" />
              <span>Home</span>
            </Link>

            <Link
              to="/opportunities"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/opportunities")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <FaCompass className="text-amber-600 text-xs" />
              <span>Opportunities</span>
            </Link>

            <Link
              to="/report-barrier"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/report-barrier")
                  ? "bg-rose-50 text-rose-700 border border-rose-200"
                  : "text-slate-700 hover:text-rose-600 hover:bg-slate-100"
              }`}
            >
              <FaExclamationTriangle className="text-rose-600 text-xs" />
              <span>Report Barrier</span>
            </Link>

            <Link
              to="/qa"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/qa")
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                  : "text-slate-700 hover:text-indigo-600 hover:bg-slate-100"
              }`}
            >
              <FaQuestionCircle className="text-indigo-600 text-xs" />
              <span>Q&A Board</span>
            </Link>

            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/about")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <FaInfoCircle className="text-xs" />
              <span>About</span>
            </Link>

            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-1.5 ${
                isActive("/contact")
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-slate-700 hover:text-blue-600 hover:bg-slate-100"
              }`}
            >
              <FaEnvelope className="text-xs" />
              <span>Contact</span>
            </Link>
          </nav>

          {/* Desktop Right User Authentication Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/wishlist"
                  className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all border border-rose-200 flex items-center space-x-1"
                  title="My Wishlist"
                >
                  <FaHeart className="text-rose-600" />
                  <span>Wishlist</span>
                </Link>

                <Link
                  to={isAdmin ? "/admin/dashboard" : "/profile"}
                  className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all border border-slate-200"
                >
                  <FaUser className="text-blue-600" />
                  <span>{user.name.split(" ")[0]}</span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-extrabold uppercase">
                      Admin
                    </span>
                  )}
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt className="text-sm" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-all font-outfit"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all font-outfit"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-blue-600 focus:outline-none"
            >
              {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Hamburger Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            Home
          </Link>
          <Link
            to="/opportunities"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700"
          >
            Opportunities
          </Link>
          <Link
            to="/report-barrier"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-rose-700 bg-rose-50/50"
          >
            Report Barrier
          </Link>
          <Link
            to="/qa"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-indigo-700 bg-indigo-50/50"
          >
            Community Q&A Board
          </Link>

          <div className="pt-4 border-t border-slate-200 space-y-2">
            {user ? (
              <>
                <Link
                  to="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-rose-50 text-rose-800 text-xs font-bold"
                >
                  My Wishlist ({user.savedOpportunities?.length || 0})
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center py-2.5 rounded-xl bg-blue-50 text-blue-800 text-xs font-bold"
                >
                  My Profile ({user.name})
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}