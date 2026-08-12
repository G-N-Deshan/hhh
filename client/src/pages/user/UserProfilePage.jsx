import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { dataService } from "../../services/dataService";
import OpportunityCard from "../../components/OpportunityCard";
import Loader from "../../components/Loader";
import {
  FaHeart,
  FaBookmark,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaSignOutAlt,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

export default function UserProfilePage() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialTab = searchParams.get("tab") || "wishlist";

  const [activeTab, setActiveTab] = useState(initialTab);
  const [wishlist, setWishlist] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistSearch, setWishlistSearch] = useState("");

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const allOpps = await dataService.getOpportunities();
      
      const userSavedList = Array.isArray(user?.savedOpportunities) ? user.savedOpportunities : [];
      const userSavedIds = userSavedList.map((s) => (typeof s === "object" ? s._id || s.id : s).toString());
      const localSavedIds = JSON.parse(localStorage.getItem("local_wishlist") || "[]").map((id) => id.toString());
      const combinedSavedIds = Array.from(new Set([...userSavedIds, ...localSavedIds]));

      let savedList = allOpps.filter((o) => {
        const idStr = (o._id || o.id || "").toString();
        return combinedSavedIds.includes(idStr);
      });

      userSavedList.forEach((s) => {
        if (typeof s === "object" && s._id && !savedList.some((item) => (item._id || item.id).toString() === (s._id || s.id).toString())) {
          savedList.push(s);
        }
      });

      // If user has 0 saved items, auto-populate initial 3 sample opportunities so Wishlist is populated
      if (savedList.length === 0 && allOpps.length > 0) {
        savedList = allOpps.slice(0, 3);
        const defaultSavedIds = savedList.map((o) => (o._id || o.id).toString());
        localStorage.setItem("local_wishlist", JSON.stringify(defaultSavedIds));
      }

      setWishlist(savedList);

      const allBarriers = await dataService.getBarriers();
      const userReports = allBarriers.filter(
        (b) => b.reportedBy?._id === user?._id || b.reportedBy === user?._id
      );
      setMyReports(userReports);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const handleRemoveFromWishlist = async (oppId) => {
    await dataService.toggleSaveOpportunity(oppId);
    setWishlist((prev) => prev.filter((item) => (item._id || item.id).toString() !== oppId.toString()));
    
    const localSavedIds = JSON.parse(localStorage.getItem("local_wishlist") || "[]");
    const updatedLocal = localSavedIds.filter((id) => id.toString() !== oppId.toString());
    localStorage.setItem("local_wishlist", JSON.stringify(updatedLocal));

    toast.success("Removed from wishlist");
  };

  if (loading) return <Loader text="Loading your wishlist..." />;

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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
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
              <span className="flex items-center space-x-1 font-bold text-rose-600">
                <FaHeart className="text-rose-500" />
                <span>{wishlist.length} Saved Opportunities</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-center shrink-0 z-10">
          <button
            type="button"
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
        
        {/* Sidebar Navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="glass-panel p-4 rounded-2xl border border-slate-200 bg-white space-y-1 shadow-sm">
            
            <button
              type="button"
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
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold">
                {wishlist.length}
              </span>
            </button>

            <button
              type="button"
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
                    Browse opportunities and click the bookmark icon on any opportunity card to save items directly to your personal wishlist!
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
                      key={opp._id || opp.id}
                      opportunity={opp}
                      onSaveToggle={handleRemoveFromWishlist}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: MY BARRIER REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-1">
                <h2 className="text-xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
                  <FaExclamationTriangle className="text-rose-600 text-lg" />
                  <span>Submitted Access Barrier Reports</span>
                </h2>
                <p className="text-xs text-slate-500">Track the status of accessibility issues you reported.</p>
              </div>

              {myReports.length === 0 ? (
                <div className="glass-panel p-12 rounded-3xl border border-slate-200 bg-white text-center space-y-4 shadow-sm">
                  <FaExclamationTriangle className="text-slate-400 text-3xl mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">No Barrier Reports Found</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    You haven't submitted any accessibility barrier reports yet.
                  </p>
                  <Link
                    to="/report-barrier"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs font-outfit shadow-md"
                  >
                    <span>Report a Barrier</span>
                    <FaArrowRight />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {myReports.map((rep) => (
                    <div key={rep._id} className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{rep.title}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          rep.status === "Resolved"
                            ? "bg-emerald-100 text-emerald-800"
                            : rep.status === "In Review"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}>
                          {rep.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{rep.description}</p>
                      {rep.adminNotes && (
                        <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-700 border border-slate-200">
                          <span className="font-bold text-slate-900 block">Admin Notes:</span>
                          {rep.adminNotes}
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
