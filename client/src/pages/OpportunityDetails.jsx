import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dataService } from "../services/dataService";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaBuilding,
  FaCheck,
  FaUser,
  FaEdit,
  FaTrash,
  FaMapMarkerAlt,
  FaPhone,
  FaEye,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaExclamationTriangle,
  FaWheelchair,
  FaHandsHelping,
  FaGlobe,
  FaFileAlt,
  FaPaperPlane,
  FaTimes,
  FaCheckCircle,
} from "react-icons/fa";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [applicantEmail, setApplicantEmail] = useState(user?.email || "");
  const [studentId, setStudentId] = useState("");
  const [statement, setStatement] = useState("");
  const [submittingApp, setSubmittingApp] = useState(false);
  const [appSubmitted, setAppSubmitted] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await dataService.getOpportunityById(id);
        setOpportunity(data);
        setSaved(user?.savedOpportunities?.some((o) => (o._id || o) === data._id) || false);

        // Fetch related opportunities
        const allOpps = await dataService.getOpportunities({ category: data.category });
        setRelated((allOpps || []).filter((o) => o._id !== id).slice(0, 3));
      } catch (err) {
        toast.error("Failed to load opportunity details");
        navigate("/opportunities");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, navigate, user]);

  if (loading) return <Loader text="Fetching full opportunity details..." />;
  if (!opportunity) return null;

  const isOwner =
    user && (isAdmin || opportunity.createdBy?._id === user._id || opportunity.createdBy === user._id);

  const handleSaveToggle = async () => {
    if (!user) {
      toast.error("Please login to save opportunities");
      return;
    }
    setSaved(!saved);
    await dataService.toggleSaveOpportunity(id);
    toast.success(saved ? "Opportunity removed from saved list" : "Opportunity saved to your profile!");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this opportunity?")) return;
    try {
      await dataService.deleteOpportunity(id);
      toast.success("Opportunity deleted successfully");
      navigate("/opportunities");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to apply for opportunities");
      navigate("/login");
      return;
    }
    setApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      toast.error("Please fill in required name and email");
      return;
    }

    setSubmittingApp(true);
    try {
      await dataService.applyOpportunity(id, {
        applicantName,
        applicantEmail,
        studentId,
        statement,
        opportunityTitle: opportunity.title,
      });
      setSubmittingApp(false);
      setAppSubmitted(true);
      toast.success(`Application submitted successfully for ${opportunity.title}!`);
    } catch (err) {
      setSubmittingApp(false);
      toast.error("Failed to submit application");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <span>/</span>
        <Link to="/opportunities" className="hover:text-blue-600">Opportunities</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold truncate max-w-xs">{opportunity.title}</span>
      </nav>

      {/* Main Glass Panel */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-8">
        
        {/* Top Header Section */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 uppercase tracking-wider">
                {opportunity.category}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                Status: {opportunity.status || "Active"}
              </span>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-slate-500">
              <span className="flex items-center space-x-1">
                <FaEye className="text-slate-400" />
                <span>{opportunity.views || 245} views</span>
              </span>
              <span>Posted: {new Date(opportunity.createdAt || Date.now()).toLocaleDateString()}</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
            {opportunity.title}
          </h1>

          {isOwner && (
            <div className="flex items-center space-x-2 pt-2">
              <Link
                to={`/opportunities/edit/${opportunity._id}`}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-amber-800 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
              >
                <FaEdit />
                <span>Edit Listing</span>
              </Link>
              <button
                onClick={handleDelete}
                className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold border border-rose-200 transition-colors flex items-center space-x-1"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Layout: Left Details + Right Key Info Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: About, Eligibility, Documents, Accessibility, Support */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-slate-900 font-outfit">About this Opportunity</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {opportunity.description}
              </p>
            </div>

            {/* Eligibility Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-outfit">Who Can Apply?</h3>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono leading-relaxed">
                {opportunity.eligibility || "Registered undergraduate students at Faculty of Technology, University of Ruhuna."}
              </p>

              {opportunity.requirements && opportunity.requirements.length > 0 && (
                <ul className="space-y-2 pt-2">
                  {opportunity.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs text-slate-700">
                      <span className="p-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-700 mt-0.5">
                        <FaCheck className="text-[10px]" />
                      </span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Required Documents Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-outfit">Required Documents</h3>
              <div className="flex flex-wrap gap-2">
                {(opportunity.requiredDocuments || ["Student ID", "Income Certificate", "National ID"]).map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 flex items-center space-x-1.5"
                  >
                    <FaFileAlt className="text-amber-600" />
                    <span>{doc}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
                <FaWheelchair className="text-blue-600" />
                <span>Accessibility Information</span>
              </h3>
              <p className="text-xs text-slate-700 bg-blue-50/60 p-4 rounded-xl border border-blue-200 leading-relaxed">
                {opportunity.accessibilityNotes || "Wheelchair accessible campus building. Staff available to assist with online form submissions."}
              </p>
            </div>

            {/* Support Section */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
                <FaHandsHelping className="text-emerald-600" />
                <span>Available Support Services</span>
              </h3>
              <p className="text-xs text-slate-700 bg-emerald-50/60 p-4 rounded-xl border border-emerald-200 leading-relaxed">
                {opportunity.supportAvailable || "Help desk available every weekday. Volunteers can assist with application submission."}
              </p>
            </div>

          </div>

          {/* Right Side: Key Information Panel & Action Buttons */}
          <div className="space-y-6">
            
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <h3 className="text-base font-bold text-slate-900 font-outfit border-b border-slate-100 pb-3">
                Key Information
              </h3>

              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Application Deadline</span>
                  <span className="text-amber-700 font-bold flex items-center space-x-1.5 mt-0.5">
                    <FaCalendarAlt />
                    <span>{new Date(opportunity.deadline).toLocaleDateString()}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Location</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5">
                    <FaMapMarkerAlt className="text-rose-600" />
                    <span>{opportunity.location || "Faculty Campus"}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Department</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5">
                    <FaBuilding className="text-amber-600" />
                    <span>{opportunity.department}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Language</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5">
                    <FaGlobe className="text-sky-600" />
                    <span>{opportunity.language || "English / Sinhala"}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Contact Unit</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5">
                    <FaUser className="text-slate-500" />
                    <span>{opportunity.contactPerson || "Student Affairs Unit"}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Email</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5 truncate">
                    <FaEnvelope className="text-rose-600" />
                    <span className="truncate">{opportunity.contactEmail}</span>
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Phone</span>
                  <span className="text-slate-800 flex items-center space-x-1.5 mt-0.5">
                    <FaPhone className="text-emerald-600" />
                    <span>{opportunity.contactPhone || "041-2292200"}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2.5 border-t border-slate-100">
                <button
                  onClick={handleApplyClick}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center justify-center space-x-2 font-outfit"
                >
                  <span>Apply Now</span>
                  <FaPaperPlane />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleSaveToggle}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center space-x-1.5 transition-colors ${
                      saved
                        ? "bg-amber-50 text-amber-800 border-amber-200"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {saved ? <FaBookmark className="text-amber-600" /> : <FaRegBookmark />}
                    <span>{saved ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FaShareAlt />
                    <span>Share</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* BARRIER SECTION */}
        <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-4">
          <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm font-outfit">
            <FaExclamationTriangle />
            <span>Did you face a problem accessing this opportunity?</span>
          </div>

          <p className="text-xs text-slate-700">
            Click a common barrier below to quick-report, or submit a detailed anonymous report:
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              "Transport Problem",
              "Language Problem",
              "Document Problem",
              "Financial Problem",
              "Internet Access Problem",
            ].map((prob, idx) => (
              <Link
                key={idx}
                to={`/report-barrier?opportunityId=${opportunity._id}&barrierType=${encodeURIComponent(prob)}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors shadow-sm"
              >
                {prob}
              </Link>
            ))}
          </div>

          <div>
            <Link
              to={`/report-barrier?opportunityId=${opportunity._id}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:underline"
            >
              <span>Report another barrier →</span>
            </Link>
          </div>
        </div>

      </div>

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 bg-white space-y-5 relative shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FaPaperPlane className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 font-outfit">Apply for Opportunity</h2>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            {appSubmitted ? (
              <div className="text-center py-6 space-y-4">
                <FaCheckCircle className="text-emerald-600 text-4xl mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 font-outfit">Application Received!</h3>
                <p className="text-xs text-slate-600">
                  Your application for <span className="text-blue-600 font-bold">{opportunity.title}</span> has been transmitted to <span className="text-slate-800 font-mono">{opportunity.contactEmail}</span>.
                </p>
                <button
                  onClick={() => {
                    setApplyModalOpen(false);
                    setAppSubmitted(false);
                  }}
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs font-outfit"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <span className="text-slate-500">Applying for:</span>{" "}
                  <span className="font-bold text-slate-900">{opportunity.title}</span>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Applicant Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Kasun Perera"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="student@fot.ruh.ac.lk"
                      value={applicantEmail}
                      onChange={(e) => setApplicantEmail(e.target.value)}
                      className="w-full bg-white text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Student ID / Reg No</label>
                    <input
                      type="text"
                      placeholder="TG/2022/1004"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      className="w-full bg-white text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Statement of Purpose / Cover Note</label>
                  <textarea
                    rows={3}
                    placeholder="Explain why you are interested in this opportunity..."
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-xs"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2 text-slate-500 text-xs font-semibold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submittingApp}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs font-outfit"
                  >
                    {submittingApp ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* Related Opportunities */}
      {related.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-slate-900 font-outfit">Related Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((opp) => (
              <div key={opp._id} className="glass-card p-5 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 uppercase">
                  {opp.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1 font-outfit">
                  <Link to={`/opportunities/${opp._id}`} className="hover:text-blue-600">
                    {opp.title}
                  </Link>
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">{opp.description}</p>
                <Link to={`/opportunities/${opp._id}`} className="text-xs font-semibold text-blue-600 inline-block pt-1">
                  View →
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
