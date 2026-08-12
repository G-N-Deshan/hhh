import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";
import OpportunityCard from "../../components/OpportunityCard";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import {
  FaHeart,
  FaBookmark,
  FaUser,
  FaBuilding,
  FaMapMarkerAlt,
  FaGlobe,
  FaWheelchair,
  FaExclamationTriangle,
  FaCog,
  FaSignOutAlt,
  FaSearch,
  FaTrash,
  FaArrowRight,
} from "react-icons/fa";

export default function UserProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const location = useLocation();

  // Initial tab set based on route query e.g. /profile?tab=wishlist
  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "wishlist";

  const [activeTab, setActiveTab] = useState(initialTab);

  const [wishlist, setWishlist] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistSearch, setWishlistSearch] = useState("");

  // Profile Form States
  const [name, setName] = useState(user?.name || "");
  const [department, setDepartment] = useState(
    user?.department || "Department of Information & Communication Technology"
  );
  const [locationState, setLocationState] = useState(user?.location || "Matara");
  const [preferredLanguage, setPreferredLanguage] = useState(user?.preferredLanguage || "English");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState(user?.accessibilityNeeds || "None");
  const [bio, setBio] = useState(user?.bio || "");
  const [interests, setInterests] = useState(
    user?.interests?.join(", ") || "Scholarships, Internships, AI"
  );
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
        setWishlist(savedList);

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
      location: locationState,
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

  const handleRemoveFromWishlist = async (id) => {
    await dataService.toggleSaveOpportunity(id);
    setWishlist((prev) => prev.filter((o) => o._id !== id));
    toast.success("Opportunity removed from your wishlist");
  };

  if (loading) return <Loader text="Loading your personal profile & wishlist..." />;

  const filteredWishlist = wishlist.filter((item) => {
    if (!wishlistSearch) return true;
    const query = wishlistSearch.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.department.toLowerCase().includes(query)
    );
  });

  return (
    <div className="py-8 space-y-8 max-w-6xl mx-auto">
      
      {/* Executive Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm relative overflow-hidden">
        <div className="flex items-start space-x-5 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-500 to-blue-600 flex items-center justify-center font-black text-white text-2xl font-outfit shadow-md shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <h1 className="text-2xl font-extrabold text-slate-900 font-outfit">
                {user?.name || "User Profile"}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider border border-rose-200">
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
                <FaHeart className="text-rose-500" />
                <span>{wishlist.length} Wishlist Items</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-center shrink-0 z-10">
          <button
            onClick={logout}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 flex items-center space-x-1.5 font-outfit cursor-pointer"
          >
            <FaSignOutAlt />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar Navigation + Content Panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
            
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-rose-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <FaHeart />
                <span>My Wishlist</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center space-x-2.5 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-blue-600 text-white font-outfit shadow-sm"
                  : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              <FaUser />
              <span>Profile & Customize</span>
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
              <span>My Barrier Reports</span>
            </button>

          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          
          {/* TAB 1: MY WISHLIST SECTION */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
                    <FaHeart className="text-rose-600 text-lg" />
                    <span>My Personal Wishlist</span>
                  </h2>
                  <p className="text-xs text-slate-500">Saved opportunities specific to your registered account.</p>
                </div>

                {/* Search in Wishlist */}
                {wishlist.length > 0 && (
                  <div className="relative w-full sm:w-64">
                    <FaSearch className="absolute left-3 top-3 text-slate-400 text-xs" />
                    <input
                      type="text"
                      placeholder="Search wishlist..."
                      value={wishlistSearch}
                      onChange={(e) => setWishlistSearch(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                )}
              </div>

              {filteredWishlist.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-slate-200 bg-white text-center space-y-4 shadow-sm">
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-2xl">
                    <FaHeart />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">Your Wishlist is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Browse opportunities and click the bookmark icon to save items directly to your personal wishlist!
                  </p>
                  <Link
                    to="/opportunities"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs font-outfit shadow-md"
                  >
                    <span>Browse Opportunities</span>
                    <FaArrowRight />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredWishlist.map((opp) => (
                    <OpportunityCard
                      key={opp._id}
                      opportunity={opp}
                      onSaveToggle={handleRemoveFromWishlist}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PROFILE DETAILS & CUSTOMIZATION */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              
              {/* Profile Read-Only Summary Card */}
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3 flex items-center space-x-2">
                  <FaUser className="text-blue-600 text-sm" />
                  <span>Account Summary & Specific Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Full Name</span>
                    <span className="font-bold text-slate-900">{user?.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Email Address</span>
                    <span className="font-bold text-slate-900 font-mono">{user?.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Faculty Department</span>
                    <span className="font-bold text-slate-900">{user?.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Account Type / Role</span>
                    <span className="font-bold text-rose-700 uppercase">{user?.role}</span>
                  </div>
                </div>

                {user?.bio && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Biography / Intro</span>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">{user?.bio}</p>
                  </div>
                )}
              </div>

              {/* Profile Customization Form */}
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
                        value={locationState}
                        onChange={(e) => setLocationState(e.target.value)}
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

        </div>

      </div>
    </div>
  );
}
