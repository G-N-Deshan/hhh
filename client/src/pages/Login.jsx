import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { FaSignInAlt, FaGraduationCap, FaEnvelope, FaLock } from "react-icons/fa";

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
              text: "continue_with",
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
      // Decode JWT payload from accounts.google.com
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
        department: "Department of Information & Communication Technology",
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
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      navigate("/opportunities");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="glass-panel w-full max-w-md p-8 rounded-3xl border border-slate-200 bg-white shadow-xl space-y-6">
        
        {/* Branding Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
              <FaGraduationCap className="w-8 h-8 text-amber-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit">Sign In to OpportunityBridge</h1>
          <p className="text-xs text-slate-500">Faculty of Technology • University of Ruhuna</p>
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
              Email Address
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
              Password
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all font-outfit flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FaSignInAlt />
            <span>{loading ? "Signing In..." : "Sign In"}</span>
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          Don't have a faculty account?{" "}
          <Link to="/register" className="text-blue-600 font-semibold hover:underline">
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
