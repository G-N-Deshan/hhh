import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FaGraduationCap,
  FaHome,
  FaCompass,
  FaExclamationTriangle,
  FaInfoCircle,
  FaEnvelope,
  FaShieldAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaUserPlus,
  FaBars,
  FaTimes,
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
          
          {/* Logo / Generic Project Name */}
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

            {/* Admin Dedicated Navigation Item */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-colors flex items-center space-x-1.5 ${
                  location.pathname.startsWith("/admin")
                    ? "bg-rose-100 text-rose-800 border border-rose-300"
                    : "text-rose-700 hover:bg-rose-50"
                }`}
              >
                <FaShieldAlt className="text-xs text-rose-600" />
                <span>Admin Portal</span>
              </Link>
            )}
          </nav>

          {/* Right Auth / Profile Menu */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                  className="flex items-center space-x-2.5 bg-slate-100 p-1.5 pl-3 pr-3 rounded-full border border-slate-200 hover:border-blue-300 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-xs font-bold text-slate-800 leading-tight">{user.name}</p>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold uppercase bg-amber-100 text-amber-800 border border-amber-300">
                      {user.role}
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-rose-600 flex items-center justify-center font-bold text-white text-xs shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2.5 rounded-full text-slate-500 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center space-x-1.5"
                >
                  <FaSignInAlt className="text-amber-600" />
                  <span>Login</span>
                </Link>

                <Link
                  to="/register"
                  className="px-3.5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm flex items-center space-x-1.5 font-outfit"
                >
                  <FaUserPlus />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              {mobileMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-2 border-t border-slate-200 bg-white rounded-b-2xl shadow-xl">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/opportunities"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Opportunities
            </Link>
            <Link
              to="/report-barrier"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-slate-100"
            >
              Report Barrier
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Contact
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-bold text-rose-700 bg-rose-50 border border-rose-200"
              >
                Admin Security Portal (/admin)
              </Link>
            )}

            <div className="pt-4 border-t border-slate-200">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to={isAdmin ? "/admin/dashboard" : "/dashboard"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-sm"
                  >
                    Dashboard ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg bg-rose-50 text-rose-700 font-semibold text-sm border border-rose-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 bg-slate-100 text-slate-800 rounded-lg font-semibold text-sm"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}