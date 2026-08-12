import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "react-icons/fa";

const CATEGORY_CARDS = [
  { name: "Scholarships", icon: "🎓", count: "12 opportunities", cat: "Scholarships" },
  { name: "Internships", icon: "💼", count: "8 opportunities", cat: "Internships" },
  { name: "Jobs & Careers", icon: "🚀", count: "15 opportunities", cat: "Jobs" },
  { name: "Training", icon: "🛠️", count: "10 opportunities", cat: "Training" },
  { name: "Financial Support", icon: "💰", count: "6 opportunities", cat: "Financial Support" },
  { name: "Mental Health", icon: "🧠", count: "4 opportunities", cat: "Mental Health" },
];

export default function Home() {
  const navigate = useNavigate();
  const [opportunities, setOpportunities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [oppsData, analyticsData] = await Promise.all([
          dataService.getOpportunities(),
          dataService.getAnalytics(),
        ]);
        setOpportunities((oppsData || []).slice(0, 3));
        setAnalytics(analyticsData.summary || null);
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

  return (
    <div className="space-y-20 py-6">
      
      {/* SECTION 1: HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 border border-slate-200 bg-gradient-to-br from-white via-blue-50/50 to-amber-50/30">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
            <FaGraduationCap className="text-amber-600 w-4 h-4" />
            <span>National Opportunity Portal • Sri Lanka</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 font-outfit tracking-tight leading-tight">
            Find Opportunities in Your <span className="gradient-text-primary">Community</span>
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed">
            Many opportunities already exist around you. oppotunity brige helps you discover scholarships, internships, training programs, and report the barriers that stop people from accessing them.
          </p>

          {/* Hero Search Bar */}
          <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-2xl">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search opportunities (e.g. Scholarship, Python, Laptop)..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full bg-white text-slate-900 pl-11 pr-4 py-3.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md font-outfit shrink-0"
            >
              Search Opportunities
            </button>
          </form>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/opportunities"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm font-outfit shadow-md transition-all flex items-center space-x-2"
            >
              <FaCompass />
              <span>Explore Opportunities</span>
            </Link>

            <Link
              to="/report-barrier"
              className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 font-bold text-sm transition-all shadow-sm flex items-center space-x-2"
            >
              <FaExclamationTriangle className="text-rose-600" />
              <span>Report a Barrier</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATEGORY SECTION */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 font-outfit">Opportunity Categories</h2>
          <p className="text-sm text-slate-500">Browse opportunities tailored to your needs</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORY_CARDS.map((cat, idx) => (
            <Link
              key={idx}
              to={`/opportunities?category=${encodeURIComponent(cat.cat)}`}
              className="glass-card rounded-2xl p-5 border border-slate-200 text-center hover:border-blue-400 transition-all group flex flex-col items-center space-y-2"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</span>
              <h3 className="text-sm font-bold text-slate-800 font-outfit group-hover:text-blue-600">{cat.name}</h3>
              <span className="text-[11px] font-mono text-slate-500">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 3: FEATURED OPPORTUNITIES */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-outfit">Featured Opportunities</h2>
            <p className="text-sm text-slate-500">Recently published scholarships, internships, and support services</p>
          </div>
          <Link
            to="/opportunities"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <FaArrowRight className="text-xs" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <OpportunityCard key={opp._id} opportunity={opp} />
            ))}
          </div>
        )}
      </section>

      {/* SECTION 4: HOW IT WORKS */}
      <section className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-200 bg-white space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 font-outfit">How oppotunity brige Works</h2>
          <p className="text-sm text-slate-500">Simple steps to connect opportunities with people</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-2xl font-bold font-outfit">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Discover Opportunities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Browse scholarships, internships, training programs, and financial support services available across the faculty.
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center text-2xl font-bold font-outfit">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Report Barriers</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tell us what is stopping you or others from accessing an opportunity (transport, financial, awareness, internet).
            </p>
          </div>

          <div className="text-center space-y-3 p-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center text-2xl font-bold font-outfit">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-outfit">Improve Community Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Faculty administrators review reported barriers, assign resources, and improve accessibility for all students.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5: BARRIER REPORTING SECTION */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-200 bg-rose-50/60 relative overflow-hidden">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-widest">
            <FaExclamationTriangle />
            <span>Community Accessibility Action</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-outfit">
            What is preventing opportunities from reaching people?
          </h2>

          <p className="text-slate-700 text-sm leading-relaxed">
            Many opportunities exist, but people cannot access them because of transport, language, awareness, financial, or technical barriers. If you faced a problem, report it anonymously to help administrators fix it.
          </p>

          {/* Barrier Badges */}
          <div className="flex flex-wrap gap-2">
            {[
              "Lack of Awareness",
              "Transport Problems",
              "Financial Constraints",
              "Language Barriers",
              "Internet Access Issues",
              "Missing Documents",
              "Disability Access",
              "Complex Process",
            ].map((badge, idx) => (
              <span
                key={idx}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white text-rose-800 border border-rose-200 shadow-sm"
              >
                {badge}
              </span>
            ))}
          </div>

          <div className="pt-2">
            <Link
              to="/report-barrier"
              className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md transition-all inline-flex items-center space-x-2 font-outfit"
            >
              <FaExclamationTriangle />
              <span>Report a Barrier Anonymously</span>
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: STATISTICS SECTION */}
      {analytics && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Opportunities"
            value={analytics.totalOpportunities || 45}
            icon={<FaBriefcase />}
            color="amber"
            description="Active opportunities"
          />
          <StatCard
            title="Total Users"
            value={analytics.totalUsers || 320}
            icon={<FaUsers />}
            color="purple"
            description="Community members"
          />
          <StatCard
            title="Barrier Reports"
            value={analytics.totalBarriers || 87}
            icon={<FaExclamationTriangle />}
            color="rose"
            description="Access gaps reported"
          />
          <StatCard
            title="Resolved Barriers"
            value={analytics.resolvedBarriers || 34}
            icon={<FaCheckCircle />}
            color="emerald"
            description="Issues solved by admin"
          />
        </section>
      )}

      {/* SECTION 7: SUCCESS STORIES */}
      <section className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-3xl font-bold text-slate-900 font-outfit">Community Success Stories</h2>
          <p className="text-sm text-slate-500">See how oppotunity brige has helped students</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3">
            <FaQuoteLeft className="text-amber-500 text-2xl" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "I found a laptop support grant through this platform and received help with my application when I didn't know where to submit documents."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Kasun Perera</p>
              <p className="text-[11px] text-slate-500 font-mono">Student, Dept. of Information & Comm. Technology</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3">
            <FaQuoteLeft className="text-blue-500 text-2xl" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Reporting the Lab 2 software license barrier led to administrators updating floating keys within 3 days. Real impact!"
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Nisal Silva</p>
              <p className="text-[11px] text-slate-500 font-mono">Undergraduate, Engineering Technology</p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-200 space-y-3">
            <FaQuoteLeft className="text-emerald-500 text-2xl" />
            <p className="text-xs text-slate-600 leading-relaxed italic">
              "Posting industrial IoT internship positions on oppotunity brige helped us connect directly with qualified technology students."
            </p>
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-900">Dr. K. L. Perera</p>
              <p className="text-[11px] text-slate-500 font-mono">Senior Lecturer & Project Coordinator</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FINAL CALL TO ACTION */}
      <section className="glass-panel p-10 rounded-3xl border border-blue-200 text-center space-y-6 bg-gradient-to-r from-blue-50 via-white to-amber-50">
        <h2 className="text-3xl font-extrabold text-slate-900 font-outfit">
          Ready to Explore Opportunities?
        </h2>
        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Discover scholarships, internships, and training, or help your peers by reporting access barriers today.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/opportunities"
            className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md font-outfit"
          >
            Browse Opportunities
          </Link>
          <Link
            to="/report-barrier"
            className="px-6 py-3.5 bg-white hover:bg-slate-50 text-rose-700 border border-rose-200 font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            Report a Barrier
          </Link>
        </div>
      </section>

    </div>
  );
}