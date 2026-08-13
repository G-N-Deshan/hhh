import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { dataService } from "../services/dataService";
import OpportunityCard from "../components/OpportunityCard";
import StatCard from "../components/StatCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import {
  FaCompass,
  FaExclamationTriangle,
  FaGraduationCap,
  FaSearch,
  FaBriefcase,
  FaUsers,
  FaQuoteLeft,
  FaArrowRight,
  FaCheckCircle,
  FaStar,
  FaRegStar,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

const CATEGORY_CARDS = [
  { name: "Scholarships", icon: "🎓", count: "10 opportunities", cat: "Scholarships" },
  { name: "Internships", icon: "💼", count: "10 opportunities", cat: "Internships" },
  { name: "Jobs & Careers", icon: "🚀", count: "10 opportunities", cat: "Jobs" },
  { name: "Training", icon: "🛠️", count: "10 opportunities", cat: "Training" },
  { name: "Financial Support", icon: "💰", count: "10 opportunities", cat: "Financial Support" },
  { name: "Mental Health", icon: "🧠", count: "10 opportunities", cat: "Mental Health" },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [siteReviews, setSiteReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  // Platform Review Modal State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchSiteReviews = async () => {
    const data = await dataService.getSiteReviews();
    setSiteReviews(data.reviews || []);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppsData, analyticsData, reviewsData] = await Promise.all([
          dataService.getOpportunities(),
          dataService.getAnalytics(),
          dataService.getSiteReviews(),
        ]);
        setOpportunities((oppsData || []).slice(0, 3));
        setAnalytics(analyticsData.summary || null);
        setSiteReviews(reviewsData.reviews || []);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchKeyword.trim()) {
      navigate(`/opportunities?keyword=${encodeURIComponent(searchKeyword.trim())}`);
    }
  };

  const handleSiteReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to post a website review");
      return;
    }
    if (!newTitle.trim() || !newComment.trim()) {
      toast.error("Please fill in both title and comment");
      return;
    }

    setSubmittingReview(true);
    const res = await dataService.createSiteReview({
      title: newTitle.trim(),
      comment: newComment.trim(),
      rating: newRating,
    });
    setSubmittingReview(false);

    if (res) {
      toast.success("Thank you for your platform review!");
      setReviewModalOpen(false);
      setNewTitle("");
      setNewComment("");
      fetchSiteReviews();
    }
  };

  return (
    <div className="space-y-16 pb-12 text-slate-800">
      
      {/* HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative rounded-3xl p-8 sm:p-12 text-slate-900 overflow-hidden shadow-sm border border-slate-200">
        
        {/* Background Image Container */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1920&auto=format&fit=crop')`,
          }}
        />
        
        {/* Light Gradient Overlay to preserve clear contrast for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/85 to-white/95 backdrop-blur-[2px]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-outfit tracking-tight leading-tight text-slate-900">
            Connecting <span className="text-blue-600">Opportunities</span>, Breaking Access Barriers.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-sans leading-relaxed">
            Discover scholarships, internships, part-time jobs, and support programs tailored for undergraduates. Report physical & digital accessibility barriers directly to admins.
          </p>

          {/* Search Input Box */}
          <form onSubmit={handleHeroSearch} className="pt-2 max-w-xl mx-auto">
            <div className="relative flex items-center">
              <FaSearch className="absolute left-4 text-slate-400 text-sm" />
              <input
                type="text"
                placeholder="Search scholarships, internships, jobs, or training..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-white/90 text-slate-900 border border-slate-300 pl-11 pr-32 py-4 rounded-2xl shadow-md focus:outline-none focus:border-blue-500 text-sm font-outfit placeholder-slate-400 backdrop-blur-sm"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all font-outfit cursor-pointer"
              >
                Search
              </button>
            </div>
          </form>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-4 text-xs font-semibold text-slate-600">
            <Link
              to="/opportunities?category=Scholarships"
              className="px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 transition-all flex items-center space-x-1.5 text-slate-800 shadow-sm backdrop-blur-sm"
            >
              <span>🎓 Scholarships</span>
            </Link>
            <Link
              to="/opportunities?category=Internships"
              className="px-3.5 py-1.5 rounded-xl bg-white/80 hover:bg-white border border-slate-200/80 transition-all flex items-center space-x-1.5 text-slate-800 shadow-sm backdrop-blur-sm"
            >
              <span>💼 Internships</span>
            </Link>
            <Link
              to="/report-barrier"
              className="px-3.5 py-1.5 rounded-xl bg-rose-50/90 hover:bg-rose-100 border border-rose-200 text-rose-800 transition-all flex items-center space-x-1.5 shadow-sm backdrop-blur-sm"
            >
              <span>⚠️ Report Barrier</span>
            </Link>
          </div>

        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">Explore by Category</h2>
            <p className="text-xs text-slate-500">Targeted support streams for all undergraduates</p>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>View all categories</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CARDS.map((item, idx) => (
            <Link
              key={idx}
              to={`/opportunities?category=${encodeURIComponent(item.cat)}`}
              className="glass-card p-5 rounded-2xl border border-slate-200 bg-white hover:border-blue-400 transition-all text-center space-y-2 group"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-bold text-slate-900 text-xs font-outfit">{item.name}</h3>
              <p className="text-[10px] text-slate-500">{item.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED OPPORTUNITIES FEED */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit">Featured Opportunities</h2>
            <p className="text-xs text-slate-500">Latest active listings verified by Admins & Lecturers</p>
          </div>
          <Link
            to="/opportunities"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <span>Browse all listings</span>
            <FaArrowRight className="text-[10px]" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id || opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>

      {/* STATS OVERVIEW */}
      {analytics && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Registered Users"
            value={analytics.totalUsers || 14}
            icon={<FaUsers />}
            color="blue"
            description="Students, Lecturers & Staff"
          />
          <StatCard
            title="Active Opportunities"
            value={analytics.openOpportunities || 100}
            icon={<FaBriefcase />}
            color="amber"
            description="Across 10 categories"
          />
          <StatCard
            title="Reported Access Barriers"
            value={analytics.totalBarriers || 1}
            icon={<FaExclamationTriangle />}
            color="rose"
            description="Access gaps reported"
          />
          <StatCard
            title="Resolved Barriers"
            value={analytics.resolvedBarriers || 1}
            icon={<FaCheckCircle />}
            color="emerald"
            description="Issues solved by admin"
          />
        </section>
      )}

      {/* WEBSITE REVIEWS & TESTIMONIALS SECTION */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
              <FaStar className="text-amber-400" />
              <span>Platform Reviews & Feedback</span>
            </h2>
            <p className="text-xs text-slate-500">User reviews regarding website experience & barrier resolution</p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please sign in to write a website review");
                return;
              }
              setReviewModalOpen(true);
            }}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl font-outfit shadow-sm flex items-center space-x-1.5 cursor-pointer self-start sm:self-auto"
          >
            <FaPlus />
            <span>Write Website Review</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {siteReviews.map((rev) => (
            <div key={rev._id} className="glass-card p-6 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <FaQuoteLeft className="text-amber-400 text-xl" />
                <div className="flex items-center space-x-1 text-amber-400 text-xs">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s}>{s <= rev.rating ? "★" : "☆"}</span>
                  ))}
                </div>
              </div>
              
              <h4 className="font-bold text-slate-900 text-sm font-outfit">{rev.title}</h4>
              
              <p className="text-xs text-slate-600 leading-relaxed italic">
                "{rev.comment}"
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{rev.userName}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{rev.userDepartment}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                  {rev.userRole}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="glass-panel p-10 rounded-3xl border border-slate-200 text-center space-y-6 bg-blue-50/50">
        <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">
          Ready to Explore Opportunities?
        </h2>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Discover scholarships, internships, and training, or help your peers by reporting access barriers today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/opportunities"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-sm font-outfit"
          >
            Browse Opportunities
          </Link>
          <Link
            to="/report-barrier"
            className="px-6 py-3.5 bg-white hover:bg-slate-100 text-rose-700 border border-rose-200 font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            Report a Barrier
          </Link>
        </div>
      </section>

      {/* WRITE WEBSITE REVIEW MODAL */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FaStar className="text-amber-400 text-lg" />
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Write Website Review</h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSiteReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Star Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      className="text-xl text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      {star <= newRating ? <FaStar /> : <FaRegStar className="text-slate-300" />}
                    </button>
                  ))}
                  <span className="text-xs font-bold text-amber-600">({newRating} Stars)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Review Headline / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Great Resource Platform!"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Your Review & Feedback *
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tell us how OpportunityBridge helped you find internships or solve barriers..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold font-outfit cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-outfit shadow-md cursor-pointer"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}