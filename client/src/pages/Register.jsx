import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { 
  FaUserPlus, 
  FaGraduationCap, 
  FaEnvelope, 
  FaLock, 
  FaUser, 
  FaSignInAlt, 
  FaArrowRight, 
  FaShieldAlt, 
  FaLightbulb, 
  FaCheckCircle 
} from "react-icons/fa";

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
    const googleClientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      "1060018310736-l2r63l6edmjo06.apps.googleusercontent.com";

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

    const timer = setTimeout(initGoogleGis, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleGoogleCredentialResponse = async (response) => {
    if (!response.credential) return;
    try {
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);

      setLoading(true);
      const res = await googleLogin({
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        googleId: payload.sub,
        picture: payload.picture,
        department: department || "Department of Information & Communication Technology",
      });
      setLoading(false);

      if (res.success) {
        navigate("/opportunities");
      }
    } catch (err) {
      toast.error("Failed to parse Google account response");
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
    <div className="min-h-[85vh] flex items-center justify-center py-8 px-4 sm:px-6">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Visual Banner (Visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 p-8 flex-col justify-between relative overflow-hidden text-white">
          {/* Subtle Ambient Shapes */}
          <div className="absolute -top-16 -left-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header Branding */}
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-medium text-amber-300">
              <FaGraduationCap className="text-sm" />
              <span>OpportunityBridge</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight font-outfit leading-tight">
              Bridge Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-indigo-200">
                Future Today
              </span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your premier portal for internships, academic grants, and career breakthroughs.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="relative z-10 space-y-3 my-6">
            <div className="flex items-start space-x-3 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <FaCheckCircle className="text-emerald-400 mt-0.5 text-sm shrink-0" />
              <span>Verified academic & industry opportunity listings</span>
            </div>
            <div className="flex items-start space-x-3 text-xs text-slate-200 bg-white/5 p-3 rounded-xl border border-white/10 backdrop-blur-sm">
              <FaLightbulb className="text-amber-400 mt-0.5 text-sm shrink-0" />
              <span>Direct application channels with support</span>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <FaShieldAlt className="text-blue-400" /> SSO Secured
            </span>
            <span>© 2026</span>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center space-y-6 bg-slate-50/50">
          
          {/* Header */}
          <div className="space-y-1 text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="w-12 h-12 mb-2 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <FaGraduationCap className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-outfit tracking-tight">
              Create Account
            </h1>
            <p className="text-xs text-slate-500">
              Join OpportunityBridge
            </p>
          </div>

          {/* Google SSO Box */}
          <div className="space-y-2">
            <div className="p-1 bg-white border border-slate-200 rounded-2xl shadow-sm flex items-center justify-center transition-all hover:border-slate-300">
              <div ref={googleBtnContainerRef} className="w-full flex justify-center py-1"></div>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-slate-50/50 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute">
              or register with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Full Name *
              </label>
              <div className="relative group">
                <FaUser className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xs" />
                <input
                  type="text"
                  required
                  placeholder="Kasun Perera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Email Address *
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xs" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Password *
              </label>
              <div className="relative group">
                <FaLock className="absolute left-3.5 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors text-xs" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none text-sm transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all font-outfit flex items-center justify-center space-x-2 cursor-pointer mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaUserPlus />
                  <span>Register Account</span>
                  <FaArrowRight className="text-xs opacity-70 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Login Callout */}
          <div className="pt-1">
            <Link 
              to="/login" 
              className="group p-3 bg-white border border-slate-200 hover:border-blue-300 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between px-4 text-left"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center shrink-0">
                  <FaSignInAlt className="text-sm" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    Already have an account?
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sign in to your dashboard
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>Sign In</span>
                <FaArrowRight className="ml-1.5 text-[10px]" />
              </div>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}