import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import StatCard from "../../components/StatCard";
import {
  FaUsers,
  FaBriefcase,
  FaExclamationTriangle,
  FaCheckCircle,
  FaShieldAlt,
  FaEnvelope,
  FaStar,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaReply,
  FaUser,
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, opportunities, applications, barriers, messages, reviews
  const [loading, setLoading] = useState(true);

  // Data States
  const [analyticsData, setAnalyticsData] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [oppsList, setOppsList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [barriersList, setBarriersList] = useState([]);
  const [messagesList, setMessagesList] = useState([]);
  const [reviewsData, setReviewsData] = useState({ reviews: [] });

  // Filter States
  const [userSearch, setUserSearch] = useState("");
  
  const [oppSearch, setOppSearch] = useState("");
  const [oppCategoryFilter, setOppCategoryFilter] = useState("All");

  const [appSearch, setAppSearch] = useState("");
  const [appStatusFilter, setAppStatusFilter] = useState("All");
  
  const [barrierSearch, setBarrierSearch] = useState("");
  const [barrierStatusFilter, setBarrierStatusFilter] = useState("All");

  const [msgSearch, setMsgSearch] = useState("");
  const [msgStatusFilter, setMsgStatusFilter] = useState("All");

  const [reviewRatingFilter, setReviewRatingFilter] = useState("All");

  // Modals & Selection States
  const [inspectUser, setInspectUser] = useState(null);
  const [inspectOpp, setInspectOpp] = useState(null);

  const [selectedApp, setSelectedApp] = useState(null);
  const [newAppStatus, setNewAppStatus] = useState("Submitted");
  const [newAppAdminNotes, setNewAppAdminNotes] = useState("");

  const [selectedBarrier, setSelectedBarrier] = useState(null);
  const [barrierStatus, setBarrierStatus] = useState("Pending");
  const [barrierAdminNotes, setBarrierAdminNotes] = useState("");

  const [selectedMsg, setSelectedMsg] = useState(null);
  const [msgStatus, setMsgStatus] = useState("Read");
  const [msgAdminResponse, setMsgAdminResponse] = useState("");

  const [savingModal, setSavingModal] = useState(false);

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, usersRes, oppsRes, barriersRes, msgsRes, reviewsRes, appsRes] = await Promise.all([
        dataService.getAnalytics(),
        dataService.getUsers(),
        dataService.getOpportunities(),
        dataService.getBarriers(),
        dataService.getContactMessages(),
        dataService.getSiteReviews(),
        dataService.getAllApplications(),
      ]);

      setAnalyticsData(analyticsRes);
      setUsersList(usersRes || []);
      setOppsList(oppsRes || []);
      setBarriersList(barriersRes || []);
      setMessagesList(msgsRes || []);
      setReviewsData(reviewsRes || { reviews: [] });
      setApplicationsList(appsRes || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
      toast.error("Error loading administrative datasets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, []);

  // --- CRUD ACTIONS ---
  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user account?")) {
      await dataService.deleteUser(userId);
      toast.success("User removed");
      loadAllAdminData();
    }
  };

  const handleDeleteOpp = async (oppId) => {
    if (window.confirm("Are you sure you want to delete this opportunity listing?")) {
      await dataService.deleteOpportunity(oppId);
      toast.success("Opportunity removed");
      loadAllAdminData();
    }
  };

  const handleUpdateAppStatus = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;
    setSavingModal(true);
    const res = await dataService.updateApplicationStatus(selectedApp._id, {
      status: newAppStatus,
      adminNotes: newAppAdminNotes,
    });
    setSavingModal(false);
    if (res) {
      toast.success("Application status updated!");
      setSelectedApp(null);
      loadAllAdminData();
    }
  };

  const handleDeleteApp = async (appId) => {
    if (window.confirm("Are you sure you want to delete this application record?")) {
      await dataService.deleteApplication(appId);
      toast.success("Application record deleted");
      loadAllAdminData();
    }
  };

  const handleUpdateBarrierStatus = async (e) => {
    e.preventDefault();
    if (!selectedBarrier) return;
    setSavingModal(true);
    const res = await dataService.updateBarrierStatus(selectedBarrier._id, {
      status: barrierStatus,
      adminNotes: barrierAdminNotes,
    });
    setSavingModal(false);
    if (res) {
      toast.success("Barrier status & resolution notes saved");
      setSelectedBarrier(null);
      loadAllAdminData();
    }
  };

  const handleDeleteBarrier = async (barrierId) => {
    if (window.confirm("Are you sure you want to delete this barrier report?")) {
      await dataService.deleteBarrier(barrierId);
      toast.success("Barrier report removed");
      loadAllAdminData();
    }
  };

  const handleSaveMsgResponse = async (e) => {
    e.preventDefault();
    if (!selectedMsg) return;
    setSavingModal(true);
    const res = await dataService.updateContactStatus(selectedMsg._id, {
      status: msgAdminResponse.trim() ? "Replied" : msgStatus,
      adminResponse: msgAdminResponse.trim(),
    });
    setSavingModal(false);
    if (res) {
      toast.success("Contact message response saved");
      setSelectedMsg(null);
      loadAllAdminData();
    }
  };

  const handleDeleteMsg = async (msgId) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      await dataService.deleteContactMessage(msgId);
      toast.success("Contact message removed");
      loadAllAdminData();
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      await dataService.deleteSiteReview(reviewId);
      toast.success("Review removed");
      loadAllAdminData();
    }
  };

  if (loading) return <Loader text="Synchronizing Faculty Executive Command Center..." />;

  const unreadMsgCount = messagesList.filter((m) => m.status === "Unread").length;
  const pendingBarrierCount = barriersList.filter((b) => b.status === "Pending").length;

  // Filtered Datasets
  const filteredUsers = usersList.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      (u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q)
    );
  });

  const filteredOpps = oppsList.filter((o) => {
    if (oppCategoryFilter !== "All" && o.category !== oppCategoryFilter) return false;
    if (!oppSearch) return true;
    const q = oppSearch.toLowerCase();
    return (
      (o.title || "").toLowerCase().includes(q) ||
      (o.department || "").toLowerCase().includes(q) ||
      (o.category || "").toLowerCase().includes(q)
    );
  });

  const filteredApps = applicationsList.filter((app) => {
    if (appStatusFilter !== "All" && app.status !== appStatusFilter) return false;
    if (!appSearch) return true;
    const q = appSearch.toLowerCase();
    return (
      (app.applicantName || "").toLowerCase().includes(q) ||
      (app.applicantEmail || "").toLowerCase().includes(q) ||
      (app.opportunityTitle || app.opportunity?.title || "").toLowerCase().includes(q) ||
      (app.studentId || "").toLowerCase().includes(q)
    );
  });

  const filteredBarriers = barriersList.filter((b) => {
    if (barrierStatusFilter !== "All" && b.status !== barrierStatusFilter) return false;
    if (!barrierSearch) return true;
    const q = barrierSearch.toLowerCase();
    return (
      (b.title || "").toLowerCase().includes(q) ||
      (b.location || "").toLowerCase().includes(q) ||
      (b.category || "").toLowerCase().includes(q)
    );
  });

  const filteredMsgs = messagesList.filter((m) => {
    if (msgStatusFilter !== "All" && m.status !== msgStatusFilter) return false;
    if (!msgSearch) return true;
    const q = msgSearch.toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      (m.message || "").toLowerCase().includes(q)
    );
  });

  const filteredReviews = (reviewsData.reviews || []).filter((r) => {
    if (reviewRatingFilter === "All") return true;
    return r.rating === Number(reviewRatingFilter);
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Accepted":
      case "Shortlisted":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Under Review":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "Rejected":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-blue-100 text-blue-800 border-blue-300";
    }
  };

  return (
    <div className="space-y-8 py-6 text-slate-800">
      
      {/* EXECUTIVE ADMIN HEADER */}
      <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-widest px-3 py-1 rounded-full bg-rose-50 border border-rose-200 font-mono">
            <FaShieldAlt />
            <span>Faculty Executive Command Center • Dean's Office</span>
          </div>
          
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
            Administrative Control Dashboard
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Unified management for registered users, job applications, opportunity listings, barrier reports, and contact support.
          </p>
        </div>

        {/* Create Action Button */}
        <div className="flex items-center space-x-3 shrink-0 z-10">
          <button
            type="button"
            onClick={() => navigate("/opportunities/create")}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-outfit shadow-md flex items-center space-x-2 cursor-pointer"
          >
            <FaPlus />
            <span>Post New Opportunity</span>
          </button>
        </div>
      </div>

      {/* EXECUTIVE CONTROL TAB NAVIGATION HEADER */}
      <div className="glass-panel p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-2 overflow-x-auto scrollbar-none">
        
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "overview"
              ? "bg-slate-900 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaShieldAlt className="text-amber-400" />
          <span>Executive Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "users"
              ? "bg-blue-600 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaUsers />
          <span>Registered Users ({usersList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("opportunities")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "opportunities"
              ? "bg-blue-600 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaBriefcase />
          <span>Opportunities ({oppsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("applications")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "applications"
              ? "bg-blue-600 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaPaperPlane />
          <span>Applications ({applicationsList.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("barriers")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "barriers"
              ? "bg-rose-600 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaExclamationTriangle />
          <span>Barrier Reports ({barriersList.length})</span>
          {pendingBarrierCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-mono font-bold">
              {pendingBarrierCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("messages")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "messages"
              ? "bg-rose-600 text-white font-outfit shadow-md"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaEnvelope />
          <span>Contact Messages ({messagesList.length})</span>
          {unreadMsgCount > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-mono font-bold animate-pulse">
              {unreadMsgCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("reviews")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 shrink-0 cursor-pointer ${
            activeTab === "reviews"
              ? "bg-amber-500 text-slate-950 font-outfit shadow-md font-black"
              : "text-slate-700 hover:bg-slate-100"
          }`}
        >
          <FaStar />
          <span>User Reviews ({reviewsData.reviews?.length || 0})</span>
        </button>

      </div>

      {/* ========================================================================= */}
      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === "overview" && analyticsData && (
        <div className="space-y-8">
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard title="Total Opps" value={oppsList.length} icon={<FaBriefcase />} color="amber" />
            <StatCard title="Total Applications" value={applicationsList.length} icon={<FaPaperPlane />} color="blue" />
            <StatCard title="Total Users" value={usersList.length} icon={<FaUsers />} color="purple" />
            <StatCard title="Barrier Reports" value={barriersList.length} icon={<FaExclamationTriangle />} color="rose" />
            <StatCard title="Pending Barriers" value={pendingBarrierCount} icon={<FaExclamationTriangle />} color="rose" />
            <StatCard title="Support Messages" value={messagesList.length} icon={<FaEnvelope />} color="blue" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <button
              onClick={() => setActiveTab("users")}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition-all text-left space-y-1 group cursor-pointer"
            >
              <FaUsers className="text-blue-600 text-xl group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm font-outfit">Registered Users</h3>
              <p className="text-xs text-slate-500">Inspect registered user accounts ({usersList.length})</p>
            </button>

            <button
              onClick={() => setActiveTab("applications")}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition-all text-left space-y-1 group cursor-pointer"
            >
              <FaPaperPlane className="text-blue-600 text-xl group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm font-outfit">Job Applications</h3>
              <p className="text-xs text-slate-500">Review & control submitted applications ({applicationsList.length})</p>
            </button>

            <button
              onClick={() => setActiveTab("opportunities")}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-500 transition-all text-left space-y-1 group cursor-pointer"
            >
              <FaBriefcase className="text-amber-600 text-xl group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm font-outfit">Manage Opportunities</h3>
              <p className="text-xs text-slate-500">Listings across 10 categories ({oppsList.length})</p>
            </button>

            <button
              onClick={() => setActiveTab("barriers")}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-rose-500 transition-all text-left space-y-1 group cursor-pointer"
            >
              <FaExclamationTriangle className="text-rose-600 text-xl group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm font-outfit">Access Barriers</h3>
              <p className="text-xs text-slate-500">Review & resolve student reports ({barriersList.length})</p>
            </button>

            <button
              onClick={() => setActiveTab("messages")}
              className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white hover:border-rose-500 transition-all text-left space-y-1 group cursor-pointer"
            >
              <FaEnvelope className="text-rose-600 text-xl group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-slate-900 text-sm font-outfit">Contact Messages</h3>
              <p className="text-xs text-slate-500">{unreadMsgCount} unread support inquiries</p>
            </button>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MANAGE REGISTERED USERS */}
      {/* ========================================================================= */}
      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-96">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search registered users by name or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="text-xs font-bold text-slate-500 font-mono">
              Total Registered Users: <span className="text-blue-600 font-extrabold">{filteredUsers.length}</span>
            </div>
          </div>

          <div className="glass-panel rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider font-mono">
                  <th className="p-4">User Details</th>
                  <th className="p-4">Account ID</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                        <FaUser className="text-blue-500 text-xs" />
                        <span>{u.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">{u.email}</p>
                    </td>
                    <td className="p-4 font-mono text-slate-500 text-[11px]">
                      {u._id}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setInspectUser(u)}
                        className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs border border-blue-200 cursor-pointer font-bold"
                        title="View Details"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs border border-rose-200 cursor-pointer font-bold"
                        title="Delete User"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MANAGE OPPORTUNITIES */}
      {/* ========================================================================= */}
      {activeTab === "opportunities" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search listings by title..."
                value={oppSearch}
                onChange={(e) => setOppSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => navigate("/opportunities/create")}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center space-x-1.5 cursor-pointer font-outfit"
            >
              <FaPlus />
              <span>Create Opportunity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredOpps.map((opp) => (
              <div key={opp._id} className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase font-mono">
                    {opp.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm font-outfit mt-2 line-clamp-2">{opp.title}</h3>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase">
                    {opp.status || "Open"}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => setInspectOpp(opp)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs border border-blue-200 cursor-pointer"
                      title="Inspect Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => navigate(`/opportunities/edit/${opp._id}`)}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs border border-slate-200 cursor-pointer"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteOpp(opp._id)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs border border-rose-200 cursor-pointer"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MANAGE & FILTER JOB APPLICATIONS */}
      {/* ========================================================================= */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search by student name, email, or job title..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {["All", "Submitted", "Under Review", "Shortlisted", "Accepted", "Rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    appStatusFilter === st
                      ? "bg-blue-600 text-white font-outfit shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredApps.length === 0 ? (
            <div className="glass-panel p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <FaPaperPlane className="text-slate-300 text-3xl mx-auto" />
              <h3 className="text-lg font-bold text-slate-800 font-outfit">No Applications Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your status filter or search keyword.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredApps.map((app) => (
                <div
                  key={app._id}
                  className="glass-card p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm font-outfit">
                          {app.opportunityTitle || app.opportunity?.title || "Faculty Opportunity"}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadgeClass(app.status)} shrink-0`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-mono">Applicant Name</span>
                        <span className="font-bold text-slate-900 flex items-center space-x-1">
                          <FaUser className="text-blue-500 text-[10px]" />
                          <span>{app.applicantName}</span>
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-mono">Email Address</span>
                        <span className="font-bold text-slate-800 font-mono truncate block">{app.applicantEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase font-mono">ID / Reg No</span>
                        <span className="font-bold text-slate-800 font-mono">{app.studentId || "N/A"}</span>
                      </div>
                    </div>

                    {app.coverNote && (
                      <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono block mb-1">Cover Note</span>
                        <p className="italic">"{app.coverNote}"</p>
                      </div>
                    )}

                    {app.adminNotes && (
                      <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-950 border border-blue-200">
                        <span className="text-[10px] font-bold text-blue-900 uppercase font-mono block mb-1">Admin Response Note</span>
                        <p>{app.adminNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedApp(app);
                        setNewAppStatus(app.status || "Submitted");
                        setNewAppAdminNotes(app.adminNotes || "");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center space-x-1.5 cursor-pointer font-outfit"
                    >
                      <FaEdit />
                      <span>Update Status</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteApp(app._id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs cursor-pointer"
                      title="Delete Application"
                    >
                      <FaTrash />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MANAGE BARRIER REPORTS */}
      {/* ========================================================================= */}
      {activeTab === "barriers" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search barrier reports..."
                value={barrierSearch}
                onChange={(e) => setBarrierSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              {["All", "Pending", "In Review", "Resolved"].map((st) => (
                <button
                  key={st}
                  onClick={() => setBarrierStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    barrierStatusFilter === st
                      ? "bg-rose-600 text-white font-outfit shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredBarriers.map((bar) => (
              <div key={bar._id} className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm font-outfit">{bar.title}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    bar.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-800"
                      : bar.status === "In Review"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {bar.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600">{bar.description}</p>
                
                {bar.adminNotes && (
                  <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-200">
                    <span className="font-bold text-slate-900 block text-[10px] uppercase font-mono">Admin Resolution Notes:</span>
                    {bar.adminNotes}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedBarrier(bar);
                      setBarrierStatus(bar.status || "Pending");
                      setBarrierAdminNotes(bar.adminNotes || "");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer font-outfit"
                  >
                    <FaEdit />
                    <span>Update Status</span>
                  </button>
                  <button
                    onClick={() => handleDeleteBarrier(bar._id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: CONTACT MESSAGES */}
      {/* ========================================================================= */}
      {activeTab === "messages" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
              <input
                type="text"
                placeholder="Search contact messages..."
                value={msgSearch}
                onChange={(e) => setMsgSearch(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="flex items-center space-x-1.5">
              {["All", "Unread", "Read", "Replied"].map((st) => (
                <button
                  key={st}
                  onClick={() => setMsgStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    msgStatusFilter === st
                      ? "bg-rose-600 text-white font-outfit shadow-sm"
                      : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredMsgs.map((msg) => (
              <div key={msg._id} className="glass-panel p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm font-outfit">{msg.subject || "General Inquiry"}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    msg.status === "Replied"
                      ? "bg-emerald-100 text-emerald-800"
                      : msg.status === "Read"
                      ? "bg-slate-100 text-slate-700"
                      : "bg-rose-100 text-rose-800"
                  }`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-mono">From: {msg.name} ({msg.email})</p>
                <p className="text-xs text-slate-700">{msg.message}</p>

                {msg.adminResponse && (
                  <div className="p-3 bg-blue-50/60 rounded-xl text-xs text-blue-950 border border-blue-200">
                    <span className="font-bold text-blue-900 block text-[10px] uppercase font-mono">Admin Response:</span>
                    {msg.adminResponse}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setSelectedMsg(msg);
                      setMsgStatus(msg.status === "Unread" ? "Read" : msg.status);
                      setMsgAdminResponse(msg.adminResponse || "");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1 cursor-pointer font-outfit"
                  >
                    <FaReply />
                    <span>Reply / Update</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMsg(msg._id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 7: MANAGE USER REVIEWS */}
      {/* ========================================================================= */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm font-outfit">Platform User Reviews</h2>
            <div className="flex items-center space-x-1">
              {["All", "5", "4", "3"].map((star) => (
                <button
                  key={star}
                  onClick={() => setReviewRatingFilter(star)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold ${
                    reviewRatingFilter === star ? "bg-amber-500 text-slate-950" : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {star === "All" ? "All Stars" : `${star} ★`}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredReviews.map((rev) => (
              <div key={rev._id} className="glass-card p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-amber-400 text-xs">
                    <span>{"★".repeat(rev.rating)}</span>
                    <span className="text-slate-400 text-[10px] font-mono">{new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs font-outfit mt-1">{rev.title}</h4>
                  <p className="text-xs text-slate-600 italic mt-1 font-sans">"{rev.comment}"</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{rev.userName}</span>
                  <button
                    onClick={() => handleDeleteReview(rev._id)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs border border-rose-200 cursor-pointer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* UPDATE APPLICATION STATUS MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit">Update Job Application Status</h3>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            <form onSubmit={handleUpdateAppStatus} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">Applicant</span>
                <span className="font-bold text-slate-900">{selectedApp.applicantName} ({selectedApp.applicantEmail})</span>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status</label>
                <select value={newAppStatus} onChange={(e) => setNewAppStatus(e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl border text-xs">
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Admin Response Note</label>
                <textarea rows="3" value={newAppAdminNotes} onChange={(e) => setNewAppAdminNotes(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border text-xs" placeholder="Type response note to student applicant..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setSelectedApp(null)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={savingModal} className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs">{savingModal ? "Saving..." : "Save Status"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT USER MODAL */}
      {inspectUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit">User Profile Inspection</h3>
              <button onClick={() => setInspectUser(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div><span className="text-slate-400 uppercase block font-mono">Full Name</span><span className="font-bold text-slate-900 text-sm">{inspectUser.name}</span></div>
              <div><span className="text-slate-400 uppercase block font-mono">Email Address</span><span className="font-bold text-slate-900 font-mono">{inspectUser.email}</span></div>
              <div><span className="text-slate-400 uppercase block font-mono">User ID / Reference</span><span className="font-mono text-slate-700">{inspectUser._id}</span></div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setInspectUser(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT OPPORTUNITY MODAL */}
      {inspectOpp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit">Opportunity Listing Inspection</h3>
              <button onClick={() => setInspectOpp(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div><span className="text-slate-400 uppercase block font-mono">Title</span><span className="font-bold text-slate-900 text-sm">{inspectOpp.title}</span></div>
              <div><span className="text-slate-400 uppercase block font-mono">Category</span><span className="font-bold text-slate-900">{inspectOpp.category}</span></div>
              <div><span className="text-slate-400 uppercase block font-mono">Description</span><p className="text-slate-700 leading-relaxed mt-1">{inspectOpp.description}</p></div>
            </div>
            <div className="pt-2 flex justify-end">
              <button onClick={() => setInspectOpp(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE BARRIER MODAL */}
      {selectedBarrier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit">Update Barrier Resolution</h3>
              <button onClick={() => setSelectedBarrier(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            <form onSubmit={handleUpdateBarrierStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status</label>
                <select value={barrierStatus} onChange={(e) => setBarrierStatus(e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl border text-xs">
                  <option value="Pending">Pending</option>
                  <option value="In Review">In Review</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Resolution Notes</label>
                <textarea rows="3" value={barrierAdminNotes} onChange={(e) => setBarrierAdminNotes(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border text-xs" placeholder="Type resolution progress notes..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setSelectedBarrier(null)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={savingModal} className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">{savingModal ? "Saving..." : "Save Resolution"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLY CONTACT MSG MODAL */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit">Reply to Contact Inquiry</h3>
              <button onClick={() => setSelectedMsg(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer"><FaTimes /></button>
            </div>
            <form onSubmit={handleSaveMsgResponse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Status</label>
                <select value={msgStatus} onChange={(e) => setMsgStatus(e.target.value)} className="w-full bg-slate-50 p-2.5 rounded-xl border text-xs">
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                  <option value="Replied">Replied</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Admin Response Note</label>
                <textarea rows="3" value={msgAdminResponse} onChange={(e) => setMsgAdminResponse(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border text-xs" placeholder="Type response note to sender..."></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setSelectedMsg(null)} className="px-4 py-2 rounded-xl border text-xs font-bold">Cancel</button>
                <button type="submit" disabled={savingModal} className="px-5 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs">{savingModal ? "Saving..." : "Save Response"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
