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
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaWheelchair,
  FaTag,
  FaLock,
  FaGraduationCap,
} from "react-icons/fa";

export default function UserDashboard() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const [savedOpps, setSavedOpps] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [department, setDepartment] = useState(user?.department || "Department of Information & Communication Technology");
  const [location, setLocation] = useState(user?.location || "Matara");
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || "English");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(user?.accessibilityNeeds || "None");
  const [bio, setBio] = useState(user?.bio || "");
  const [interests, setInterests] = useState(user?.interests?.join(", ") || "Scholarships, Internships, AI");
  const [newPassword, setNewPassword] = useState("");
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
    const parsedInterests = interests ? interests.split(",").map((i) => i.trim()) : [];
    
    const updatePayload = {
      name,
      department,
      location,
      preferredLanguage,
      accessibilityNeeds,
      bio,
      interests: parsedInterests,
    };

    if (newPassword.trim()) {
      updatePayload.password = newPassword.trim();
    }

    const res = await updateProfile(updatePayload);
    setSavingProfile(false);

    if (res.success) {
      toast.success("Profile customized successfully!");
      setNewPassword("");
    }
  };

  const handleRemoveSaved = async (id) => {
    await dataService.toggleSaveOpportunity(id);
    setSavedOpps(savedOpps.filter((o) => o._id !== id));
    toast.success("Opportunity removed from saved list");
  };

  if (loading) return <Loader text="Loading your customized user dashboard..." />;

  const resolvedCount = myReports.filter((r) => r.status === "Resolved").length;

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-start space-x-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-rose-600 flex items-center justify-center font-black text-white text-2xl font-outfit shadow-md shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
                {user?.name || "Student"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                {user?.role || "student"}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-mono">
              {user?.department} • {user?.email}
            </p>
            <div className="flex items-center space-x-4 text-[11px] text-slate-500 pt-1 flex-wrap gap-2">
              <span className="flex items-center space-x-1">
                <FaMapMarkerAlt className="text-rose-500" />
                <span>{user?.location || "Matara"}</span>
              </span>
              <span className="flex items-center space-x-1">
                <FaGlobe className="text-sky-500" />
                <span>Language: {user?.preferredLanguage || "English"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-center shrink-0">
          <button
            onClick={() => setActiveTab("settings")}
            className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold border border-blue-200 flex items-center space-x-1.5 font-outfit cursor-pointer"
          >
            <FaCog />
            <span>Customize Profile</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center space-x-1.5 font-outfit cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Tabs + Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaThLarge />
              <span>Overview & Profile</span>
            </button>

            <button
              onClick={() => setActiveTab("saved")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                activeTab === "saved"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaBookmark />
              <span>Saved Opps ({savedOpps.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
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
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                activeTab === "settings"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaCog />
              <span>Customize Profile</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: OVERVIEW & PROFILE CARD */}
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
                  description="Submitted reports"
                />
                <StatCard
                  title="Resolved Reports"
                  value={resolvedCount}
                  icon={<FaCheckCircle />}
                  color="emerald"
                  description="Fixed issues"
                />
              </div>

              {/* Specific User Profile Details Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit flex items-center space-x-2">
                    <FaUser className="text-blue-600 text-sm" />
                    <span>Specific User Profile Information</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Department</span>
                    <span className="font-bold text-slate-800">{user?.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Account Type / Role</span>
                    <span className="font-bold text-slate-800 uppercase">{user?.role}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Location</span>
                    <span className="font-bold text-slate-800">{user?.location || "Matara"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Accessibility Preference</span>
                    <span className="font-bold text-slate-800">{user?.accessibilityNeeds || "Standard Access"}</span>
                  </div>
                </div>

                {user?.bio && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Biography / Intro</span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{user?.bio}</p>
                  </div>
                )}

                {user?.interests && user?.interests.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono mb-1.5">Focus Areas & Interests</span>
                    <div className="flex flex-wrap gap-1.5">
                      {user.interests.map((interest, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Saved Opportunities Preview */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">Recently Saved Opportunities</h3>
                  <button onClick={() => setActiveTab("saved")} className="text-xs text-blue-600 font-semibold hover:underline">
                    View All ({savedOpps.length})
                  </button>
                </div>

                {savedOpps.length === 0 ? (
                  <p className="text-xs text-slate-500 py-2">You have not saved any opportunities yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedOpps.slice(0, 2).map((opp) => (
                      <OpportunityCard key={opp._id} opportunity={opp} onSaveToggle={handleRemoveSaved} />
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

          {/* TAB 4: CUSTOMIZE PROFILE SETTINGS */}
          {activeTab === "settings" && (
            <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-sm">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 font-outfit">Customize User Profile</h3>
                <p className="text-xs text-slate-500">Update your account preferences, department, interests, and bio.</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-xs"
                    >
                      <option value="Department of Information & Communication Technology">Dept of ICT</option>
                      <option value="Department of Engineering Technology">Dept of ET</option>
                      <option value="Department of Biosystems Technology">Dept of BST</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Preferred Language</label>
                    <select
                      value={preferredLanguage}
                      onChange={(e) => setPreferredLanguage(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-xs"
                    >
                      <option value="English">English</option>
                      <option value="Sinhala">Sinhala</option>
                      <option value="Tamil">Tamil</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Accessibility Needs</label>
                    <input
                      type="text"
                      placeholder="e.g. Screen reader software, High contrast"
                      value={accessibilityNeeds}
                      onChange={(e) => setAccessibilityNeeds(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Focus Areas & Interests (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Scholarships, Internships, AI & Machine Learning, Robotics"
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Biography / About Yourself</label>
                  <textarea
                    rows={3}
                    placeholder="Briefly describe your academic background or interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm"
                  ></textarea>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">New Password (Optional)</label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep existing password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:bg-white focus:border-blue-500 focus:outline-none text-sm font-mono"
                  />
                </div>

                <div className="pt-3 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-outfit shadow-md transition-all cursor-pointer"
                  >
                    {savingProfile ? "Saving Custom Profile..." : "Save Custom Profile"}
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

