import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaUserPlus, FaGraduationCap, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("Department of Information & Communication Technology");
  const [role, setRole] = useState("student");
  const [location, setLocation] = useState("Matara");
  const [loading, setLoading] = useState(false);

  const googleBtnContainerRef = useRef(null);

  // Initialize official Google Identity Services (GIS) SDK
  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is not configured");
      return undefined;
    }

    const initGoogleGis = () => {
      if (window.google?.accounts?.id) {
        try {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
          });

          if (googleBtnContainerRef.current) {
            googleBtnContainerRef.current.innerHTML = "";
            window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
              theme: "outline",
              size: "large",
              width: "360",
              text: "signup_with",
              shape: "pill",
              logo_alignment: "left",
            });
          }
        } catch (err) {
          console.warn("Google GIS initialization error:", err.message);
        }
      }
    };

    initGoogleGis();
    const interval = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        initGoogleGis();
        window.clearInterval(interval);
      }
    }, 100);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    try {
      setLoading(true);
      const res = await googleLogin({
        credential: response.credential,
        department: department || "Department of Information & Communication Technology",
      });

      if (res.success) {
        navigate("/opportunities");
      }
    } catch (err) {
      toast.error("Google sign-in could not be completed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await register({
      name,
      email,
      password,
      department,
      role,
      location,
    });
    setLoading(false);
    if (res.success) {
      navigate("/opportunities");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4">
      <div className="glass-panel w-full max-w-lg p-8 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <FaGraduationCap className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Create Faculty Account</h1>
          <p className="text-xs text-slate-500">Join OpportunityBridge • University of Ruhuna</p>
        </div>

        {/* Single Official Google Identity Services Button */}
        <div className="flex justify-center w-full min-h-[44px]">
          <div ref={googleBtnContainerRef}></div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[11px] font-mono text-slate-400 uppercase tracking-wider absolute">or</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <FaUser className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                required
                placeholder="Kasun Perera"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Email Address *
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="email"
                required
                placeholder="name@fot.ruh.ac.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <FaLock className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full bg-white text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
              >
                <option value="Department of Information & Communication Technology">Dept of ICT</option>
                <option value="Department of Engineering Technology">Dept of ET</option>
                <option value="Department of Biosystems Technology">Dept of BST</option>
                <option value="General">General</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Account Type
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-white text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
              >
                <option value="student">Student</option>
                <option value="provider">Opportunity Provider</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all font-outfit flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FaUserPlus />
            <span>{loading ? "Creating Account..." : "Register Account"}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>

      </div>
    </div>
  );
}
