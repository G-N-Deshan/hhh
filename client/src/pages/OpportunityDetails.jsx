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
  FaStar,
  FaRegStar,
} from "react-icons/fa";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isProvider, isAdmin } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // Application Modal State
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [appSubmitted, setAppSubmitted] = useState(false);

  // Review System State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadOpportunity = async () => {
    setLoading(true);
    const data = await dataService.getOpportunityById(id);
    if (!data) {
      toast.error("Opportunity not found");
      navigate("/opportunities");
      return;
    }
    setOpportunity(data);

    if (user) {
      setApplicantName(user.name || "");
      setApplicantEmail(user.email || "");
      setIsSaved(user.savedOpportunities?.includes(data._id || data.id));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOpportunity();
  }, [id, user]);

  const handleApplyClick = () => {
    if (!user) {
      toast.error("Please log in to submit an application.");
      navigate("/login");
      return;
    }
    setApplyModalOpen(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      toast.error("Please fill in your name and email.");
      return;
    }
    try {
      await dataService.applyOpportunity(id, {
        applicantName,
        applicantEmail,
        studentId,
        coverNote,
      });
      setAppSubmitted(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error("Error submitting application.");
    }
  };

  const handleToggleSave = async () => {
    if (!user) {
      toast.error("Please log in to save opportunities.");
      return;
    }
    await dataService.toggleSaveOpportunity(opportunity._id);
    setIsSaved(!isSaved);
    toast.success(isSaved ? "Removed from wishlist" : "Saved to wishlist");
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      await dataService.deleteOpportunity(opportunity._id);
      toast.success("Opportunity deleted");
      navigate("/opportunities");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to write a review");
      return;
    }
    if (!reviewComment.trim()) {
      toast.error("Please enter a review comment");
      return;
    }

    setSubmittingReview(true);
    const res = await dataService.addOpportunityReview(opportunity._id || opportunity.id, {
      rating: reviewRating,
      comment: reviewComment.trim(),
    });
    setSubmittingReview(false);

    if (res) {
      toast.success("Review posted!");
      setReviewComment("");
      loadOpportunity();
    }
  };

  if (loading) return <Loader text="Loading opportunity details..." />;
  if (!opportunity) return null;

  const isOwner =
    user && (user._id === opportunity.createdBy || user._id === opportunity.createdBy?._id || isAdmin);

  const reviewsList = opportunity.reviews || [];
  const avgRating = opportunity.averageRating || 5.0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Info */}
      <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold font-outfit">
                {opportunity.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                {opportunity.department}
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                {opportunity.status || "Open"}
              </span>
            </div>
            
            <h1 className="text-3xl font-extrabold text-slate-900 font-outfit leading-tight">
              {opportunity.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 flex-wrap gap-y-1">
              <span className="flex items-center space-x-1">
                <FaMapMarkerAlt className="text-slate-400" />
                <span>{opportunity.location}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-rose-600 font-bold">
                <FaCalendarAlt />
                <span>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-amber-500 font-bold">
                <FaStar className="text-amber-400" />
                <span>{avgRating.toFixed(1)} ({reviewsList.length} reviews)</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleToggleSave}
              className={`p-3 rounded-2xl border text-sm font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                isSaved
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              {isSaved ? <FaBookmark className="text-rose-600" /> : <FaRegBookmark />}
              <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
            </button>

            {isOwner && (
              <>
                <Link
                  to={`/admin/opportunities/edit/${opportunity._id}`}
                  className="p-3 rounded-2xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-600 border border-slate-200 text-sm transition-all"
                  title="Edit Opportunity"
                >
                  <FaEdit />
                </Link>
                <button
                  onClick={handleDelete}
                  className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-sm transition-all cursor-pointer"
                  title="Delete Opportunity"
                >
                  <FaTrash />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description Body */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
            Overview & Description
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line font-sans">
            {opportunity.description}
          </p>
        </div>

        {/* Requirements */}
        {opportunity.requirements && opportunity.requirements.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit">
              Requirements & Eligibility
            </h3>
            <ul className="space-y-2">
              {opportunity.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                  <FaCheck className="text-emerald-500 mt-0.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Contact Info */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <h4 className="font-bold text-slate-900 uppercase tracking-wider font-outfit">Contact Information</h4>
          <div className="flex flex-wrap gap-4 text-slate-700">
            <span className="flex items-center space-x-1.5">
              <FaEnvelope className="text-blue-600" />
              <span>{opportunity.contactEmail}</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <FaPhone className="text-emerald-600" />
              <span>{opportunity.contactPhone || "041-2292200"}</span>
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2">
          <button
            onClick={handleApplyClick}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/20 transition-all font-outfit flex items-center justify-center space-x-2 cursor-pointer"
          >
            <FaPaperPlane />
            <span>Apply Now</span>
          </button>
        </div>

      </div>

      {/* REVIEWS & STAR RATING SECTION */}
      <div className="glass-panel p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
              <FaStar className="text-amber-400" />
              <span>Student & Peer Reviews</span>
            </h2>
            <p className="text-xs text-slate-500">
              Average Rating: <span className="font-bold text-slate-900">{avgRating.toFixed(1)} / 5</span> ({reviewsList.length} total reviews)
            </p>
          </div>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 font-outfit">
            Leave a Rating & Review
          </h3>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700">Rating:</span>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="text-lg text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                >
                  {star <= reviewRating ? <FaStar /> : <FaRegStar className="text-slate-300" />}
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-600">({reviewRating} / 5 Stars)</span>
          </div>

          <textarea
            rows="3"
            required
            placeholder="Write your experience or feedback about this job/opportunity listing..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            className="w-full bg-white text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-blue-500"
          ></textarea>

          <button
            type="submit"
            disabled={submittingReview}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl font-outfit shadow-sm cursor-pointer"
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </form>

        {/* Reviews List */}
        {reviewsList.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No reviews yet for this opportunity. Be the first student to leave a review!
          </p>
        ) : (
          <div className="space-y-3">
            {reviewsList.map((rev, idx) => (
              <div key={rev._id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900">{rev.userName}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold">
                      {rev.userDepartment}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s}>{s <= rev.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* REPORT BARRIER SECTION */}
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
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

      {/* APPLICATION MODAL */}
      {applyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 bg-white space-y-5 relative shadow-2xl">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FaPaperPlane className="text-blue-600" />
                <h2 className="text-xl font-bold text-slate-900 font-outfit">Apply for Opportunity</h2>
              </div>
              <button onClick={() => setApplyModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
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
                  className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs font-outfit cursor-pointer"
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
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">ID</label>
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
                    rows="3"
                    placeholder="Explain why you are interested in this opportunity..."
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    className="w-full bg-white text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:border-blue-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold font-outfit cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-outfit shadow-md cursor-pointer"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

