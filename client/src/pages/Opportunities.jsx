import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dataService } from "../services/dataService";
import OpportunityCard from "../components/OpportunityCard";
import { CardSkeleton } from "../components/SkeletonLoader";
import { useAuth } from "../context/AuthContext";
import { FaSearch, FaFilter, FaPlusCircle, FaCompass, FaTimes, FaMapMarkerAlt } from "react-icons/fa";

const CATEGORIES = [
  "Scholarships",
  "Internships",
  "Jobs",
  "Training",
  "Financial Support",
  "Mental Health",
  "Accommodation",
  "Transport",
  "Events",
  "Volunteering",
];

export default function Opportunities() {
  const [searchParams] = useSearchParams();
  const { isProvider } = useAuth();

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [locationFilter, setLocationFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [selectedDepartment, setSelectedDepartment] = useState(searchParams.get("department") || "All");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const data = await dataService.getOpportunities({
        keyword,
        category: selectedCategory,
        department: selectedDepartment,
      });
      let filtered = data || [];
      if (locationFilter) {
        filtered = filtered.filter((o) => (o.location || "").toLowerCase().includes(locationFilter.toLowerCase()));
      }
      setOpportunities(filtered);
    } catch (err) {
      toast.error("Error loading opportunities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, [selectedCategory, selectedDepartment, locationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadOpportunities();
  };

  const handleSaveToggle = async (id) => {
    try {
      await dataService.toggleSaveOpportunity(id);
    } catch (err) {
      // Local fallback handled in OpportunityCard
    }
  };

  const clearAllFilters = () => {
    setKeyword("");
    setLocationFilter("");
    setSelectedCategory("All");
    setSelectedDepartment("All");
  };

  return (
    <div className="space-y-8 py-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-200 bg-white">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-700 uppercase tracking-widest mb-1">
            <FaCompass />
            <span>Opportunities Catalog</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Opportunities</h1>
          <p className="text-slate-600 text-sm mt-1">
            Discover scholarships, internships, training programs, financial support, and community services.
          </p>
        </div>

        {isProvider && (
          <Link
            to="/opportunities/create"
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-sm flex items-center space-x-2 shrink-0 font-outfit"
          >
            <FaPlusCircle />
            <span>Post Opportunity</span>
          </Link>
        )}
      </div>

      {/* Search & Location Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="relative sm:col-span-6">
            <FaSearch className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, keyword, or tag..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div className="relative sm:col-span-4">
            <FaMapMarkerAlt className="absolute left-4 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Location: Any (e.g. Matara)"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-white text-slate-900 pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
            />
          </div>

          <button
            type="submit"
            className="sm:col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors font-outfit shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Active Filter Chips */}
        {(selectedCategory !== "All" || selectedDepartment !== "All" || keyword || locationFilter) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            <span className="font-bold text-slate-500">Active Filters:</span>

            {selectedCategory !== "All" && (
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-800 border border-blue-200 flex items-center space-x-1 font-medium">
                <span>{selectedCategory}</span>
                <button onClick={() => setSelectedCategory("All")} className="hover:text-blue-900">
                  <FaTimes className="text-[10px]" />
                </button>
              </span>
            )}

            {locationFilter && (
              <span className="px-2.5 py-1 rounded-md bg-rose-50 text-rose-800 border border-rose-200 flex items-center space-x-1 font-medium">
                <span>Location: {locationFilter}</span>
                <button onClick={() => setLocationFilter("")} className="hover:text-rose-900">
                  <FaTimes className="text-[10px]" />
                </button>
              </span>
            )}

            <button
              onClick={clearAllFilters}
              className="text-amber-700 font-semibold hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Result Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 font-mono">
          Showing <span className="text-slate-900 font-bold">{opportunities.length}</span> opportunities
        </p>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="md:hidden px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold flex items-center space-x-1 border border-slate-200"
        >
          <FaFilter className="text-amber-600 text-xs" />
          <span>Filter Categories</span>
        </button>
      </div>

      {/* Main Content Layout: Sidebar + Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Category Sidebar */}
        <div className={`md:block ${mobileFilterOpen ? "block" : "hidden"} md:col-span-1 space-y-4`}>
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-outfit border-b border-slate-100 pb-2">
              Filter by Category
            </h3>

            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("All")}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === "All" ? "bg-blue-600 text-white font-bold" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                All Categories
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white font-bold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunity Cards Grid */}
        <div className="md:col-span-3">
          {loading ? (
            <CardSkeleton count={6} />
          ) : opportunities.length === 0 ? (
            <div className="text-center py-16 glass-panel rounded-2xl border border-slate-200 bg-white text-slate-500 space-y-4">
              <p className="text-lg font-bold text-slate-800">No opportunities found.</p>
              <p className="text-sm">Try changing your filters or search keyword.</p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-outfit"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {opportunities.map((opp) => (
                <OpportunityCard key={opp._id} opportunity={opp} onSaveToggle={handleSaveToggle} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
