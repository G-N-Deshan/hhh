import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { dataService } from "../services/dataService";
import { useAuth } from "../context/AuthContext";
import { FaExclamationTriangle, FaCheckCircle, FaLock, FaArrowLeft } from "react-icons/fa";

const BARRIER_TYPES = [
  "Awareness",
  "Transport",
  "Financial",
  "Language",
  "Internet Access",
  "Documents",
  "Disability Access",
  "Timing",
  "Social Stigma",
  "Complex Process",
  "Other",
];

export default function ReportBarrierPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oppIdParam = searchParams.get("opportunityId");
  const typeParam = searchParams.get("barrierType");

  const [opportunities, setOpportunities] = useState([]);
  const [selectedOppId, setSelectedOppId] = useState(oppIdParam || "");
  const [selectedTypes, setSelectedTypes] = useState(typeParam ? [typeParam] : ["Awareness"]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("Matara");
  const [severity, setSeverity] = useState("Medium");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [consent, setConsent] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);

  useEffect(() => {
    const fetchOpps = async () => {
      try {
        const list = await dataService.getOpportunities();
        setOpportunities(list || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOpps();
  }, []);

  const handleTypeToggle = (type) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) {
      toast.error("Please agree to the consent terms");
      return;
    }

    setSubmitting(true);
    try {
      const selectedOpp = opportunities.find((o) => o._id === selectedOppId);
      const title = selectedOpp
        ? `Access Barrier for ${selectedOpp.title}`
        : `${selectedTypes.join(", ")} Barrier`;

      const reportData = {
        title,
        description,
        category: selectedTypes[0] || "Awareness",
        department: selectedOpp?.department || "Faculty Wide",
        location,
        severity,
        urgency: severity === "High" ? "High" : "Medium",
        isAnonymous,
        opportunityId: selectedOppId || null,
      };

      const result = await dataService.createBarrier(reportData);
      setSubmittedReport(result);
      toast.success("Barrier report submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit barrier report");
    } finally {
      setSubmitting(false);
    }
  };

  if (submittedReport) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="glass-panel p-8 rounded-3xl border border-emerald-200 bg-white text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 text-3xl">
            <FaCheckCircle />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">Thank You!</h1>
          <p className="text-slate-600 text-sm">
            Your barrier report has been submitted successfully to the Faculty of Technology administration.
          </p>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-mono space-y-1 text-slate-700 max-w-sm mx-auto">
            <p><span className="text-slate-500">Report ID:</span> {submittedReport._id || "BR-1024"}</p>
            <p><span className="text-slate-500">Status:</span> <span className="text-amber-700 font-bold">Pending Review</span></p>
            <p><span className="text-slate-500">Privacy:</span> {isAnonymous ? "Anonymous Submission" : "Identity Verified"}</p>
          </div>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <Link
              to="/opportunities"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs font-outfit"
            >
              Back to Opportunities
            </Link>
            <button
              onClick={() => {
                setSubmittedReport(null);
                setDescription("");
              }}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs font-outfit"
            >
              Report Another Barrier
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      
      <Link
        to="/opportunities"
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600"
      >
        <FaArrowLeft />
        <span>Back to Opportunities Catalog</span>
      </Link>

      <div className="glass-panel p-8 rounded-3xl border border-rose-200 bg-white space-y-6">
        
        {/* Header */}
        <div className="space-y-2 pb-6 border-b border-slate-100">
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-rose-700 uppercase tracking-widest">
            <FaExclamationTriangle />
            <span>Community Accessibility Action</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 font-outfit">Report a Barrier</h1>
          <p className="text-xs text-slate-600">
            Your report helps us understand what is preventing opportunities from reaching people. You can submit anonymously if you prefer.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Opportunity Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              1. Related Opportunity (Optional)
            </label>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none text-xs"
            >
              <option value="">-- General / No specific opportunity --</option>
              {opportunities.map((opp) => (
                <option key={opp._id} value={opp._id}>
                  {opp.title} ({opp.category})
                </option>
              ))}
            </select>
          </div>

          {/* 2. Barrier Type Selectable Buttons */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. What type of barrier did you face? *
            </label>
            <div className="flex flex-wrap gap-2">
              {BARRIER_TYPES.map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-rose-50 text-rose-800 border-rose-300 font-bold shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              3. Describe the problem *
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. I wanted to apply for the grant, but I did not know where to submit the physical income certificate documents..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none text-sm"
            ></textarea>
          </div>

          {/* 4. Location & Severity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                4. Location (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Matara / Kamburupitiya Campus"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white text-slate-900 px-4 py-3 rounded-xl border border-slate-300 focus:border-rose-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                5. How serious is this barrier?
              </label>
              <div className="flex space-x-4 pt-2">
                {["Low", "Medium", "High"].map((sev) => (
                  <label key={sev} className="flex items-center space-x-1.5 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={sev}
                      checked={severity === sev}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span>{sev}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* 6. Anonymous Toggle */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="flex items-center space-x-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center space-x-1">
                <FaLock className="text-amber-600 text-xs" />
                <span>Submit anonymously</span>
              </span>
            </label>
            <p className="text-[11px] text-slate-500 pl-6">
              If checked, your name and profile will not be visible to administrators.
            </p>
          </div>

          {/* 7. Consent Checkbox */}
          <div className="flex items-start space-x-2 text-xs text-slate-700">
            <input
              type="checkbox"
              id="consentCheck"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-0.5 rounded text-rose-600 focus:ring-rose-500"
            />
            <label htmlFor="consentCheck" className="cursor-pointer">
              I agree that this information may be used to improve community access and faculty opportunity reach.
            </label>
          </div>

          {/* Submit Button */}
          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-md transition-all font-outfit"
            >
              {submitting ? "Submitting Report..." : "Submit Report"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
