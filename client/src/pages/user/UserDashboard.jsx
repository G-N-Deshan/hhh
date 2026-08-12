import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";
import OpportunityCard from "../../components/OpportunityCard";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import {
  FaBookmark,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCog,
  FaThLarge,
  FaSignOutAlt,
} from "react-icons/fa";

export default function UserDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [savedOpps, setSavedOpps] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [location, setLocation] = useState(user?.location || "Matara");
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || "English");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(user?.accessibilityNeeds || "None");
  const [bio, setBio] = useState(user?.bio || "");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const allOpps = await dataService.getOpportunities();
        const storedSaved = user?.savedOpportunities || [];
        const savedList = allOpps.filter((o) =>
          storedSaved.some((s) => (s._id || s) === o._id)
        );
        setSavedOpps(savedList);

        const allBarriers = await dataService.getBarriers();
        const userReports = allBarriers.filter(
          (b) => b.reportedBy?._id === user?._id || b.reportedBy === user?._id
        );
        setMyReports(userReports);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchUserData();
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await updateProfile({
      name,
      location,
      preferredLanguage,
      accessibilityNeeds,
      bio,
    });
    setSavingProfile(false);
    if (res.success) {
      toast.success("Profile settings updated!");
    }
  };

  const handleRemoveSaved = async (id) => {
    await dataService.toggleSaveOpportunity(id);
    setSavedOpps(savedOpps.filter((o) => o._id !== id));
    toast.success("Opportunity removed from saved list");
  };

  if (loading) return <Loader text="Loading your dashboard..." />;

  const resolvedCount = myReports.filter((r) => r.status === "Resolved").length;

  return (
    <div className="py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-rose-600 flex items-center justify-center font-black text-white text-2xl font-outfit shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
              Welcome back, {user?.name || "Student"}!
            </h1>
            <p className="text-xs text-slate-500 font-mono">
              {user?.department} • {user?.email}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <FaSignOutAlt />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Layout: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaThLarge />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaBookmark />
              <span>Saved Opportunities ({savedOpps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                activeTab === "reports"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaExclamationTriangle />
              <span>My Reports ({myReports.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaCog />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  title="Saved Opportunities"
                  value={savedOpps.length}
                  icon={<FaBookmark />}
                  color="amber"
                  description="Bookmarked listings"
                />
                <StatCard
                  title="My Barrier Reports"
                  value={myReports.length}
                  icon={<FaExclamationTriangle />}
                  color="rose"
                  description="Submitted accessibility reports"
                />
                <StatCard
                  title="Resolved Reports"
                  value={resolvedCount}
                  icon={<FaCheckCircle />}
                  color="emerald"
                  description="Issues fixed by admin"
                />
              </div>

              {/* Saved Preview */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Recently Saved Opportunities</h3>
                  <button onClick={() => setActiveTab("saved")} className="text-xs text-blue-600 font-semibold hover:underline">
                    View All ({savedOpps.length})
                  </button>
                </div>

                {savedOpps.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">You have not saved any opportunities yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedOpps.slice(0, 2).map((opp) => (
                      <OpportunityCard key={opp._id} opportunity={opp} onSaveToggle={handleRemoveSaved} />
                    ))}
                  </div>
                )}
              </div>

              {/* My Reports Preview */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">My Recent Barrier Reports</h3>
                  <button onClick={() => setActiveTab("reports")} className="text-xs text-blue-600 font-semibold hover:underline">
                    View All ({myReports.length})
                  </button>
                </div>

                {myReports.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4">You have not submitted any barrier reports yet.</p>
                ) : (
                  <div className="space-y-3">
                    {myReports.slice(0, 2).map((rep) => (
                      <div key={rep._id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-slate-900 font-outfit">{rep.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{rep.category} • Status: <span className="text-amber-700 font-bold">{rep.status}</span></p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded bg-white text-slate-700 font-mono border border-slate-200">
                          {new Date(rep.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 2: SAVED OPPORTUNITIES */}
          {activeTab === "saved" && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">Saved Opportunities</h3>
              {savedOpps.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl border border-slate-200 bg-white text-center space-y-3 text-slate-500">
                  <p className="text-base font-bold text-slate-800">You have not saved any opportunities yet.</p>
                  <Link to="/opportunities" className="inline-block px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs font-outfit">
                    Explore Opportunities
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedOpps.map((opp) => (
                    <OpportunityCard key={opp._id} opportunity={opp} onSaveToggle={handleRemoveSaved} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY BARRIER REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-slate-900 font-outfit">My Barrier Reports</h3>
                <Link to="/report-barrier" className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs font-outfit">
                  + Report New Barrier
                </Link>
              </div>

              {myReports.length === 0 ? (
                <div className="glass-panel p-12 rounded-2xl border border-slate-200 bg-white text-center text-slate-500 space-y-2">
                  <p className="text-base font-bold text-slate-800">No barrier reports submitted yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((rep) => (
                    <div key={rep._id} className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono">
                            ID: {rep._id}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 font-outfit mt-1">{rep.title}</h4>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                          rep.status === "Resolved" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}>
                          {rep.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{rep.description}</p>

                      {rep.resolutionNotes && (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                          <span className="font-bold block mb-1">Admin Response:</span>
                          {rep.resolutionNotes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PROFILE SETTINGS */}
          {activeTab === "settings" && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 font-outfit">Profile Settings</h3>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Accessibility Needs</label>
                  <input
                    type="text"
                    placeholder="e.g. Wheelchair access, Screen reader software"
                    value={accessibilityNeeds}
                    onChange={(e) => setAccessibilityNeeds(e.target.value)}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-outfit"
                  >
                    {savingProfile ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
