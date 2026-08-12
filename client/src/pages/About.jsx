import React from "react";
import { FaGraduationCap, FaBullseye, FaExclamationTriangle, FaCheckCircle } from "react-icons/fa";

export default function About() {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
          <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
            <FaGraduationCap className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">About OpportunityBridge</h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Connecting community opportunities with the people who need them most at the Faculty of Technology, University of Ruhuna.
        </p>
      </div>

      {/* Mission & Problem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-lg">
            <FaBullseye />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-outfit">Our Mission</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            To create an inclusive, transparent platform where every technology student and faculty member can discover academic grants, industry internships, research projects, and mental health support services without artificial barriers.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-200 bg-white space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center text-lg">
            <FaExclamationTriangle />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-outfit">The Problem We Solve</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Many valuable opportunities exist, but students fail to access them due to lack of awareness, transport difficulties, financial constraints, document hurdles, or internet access gaps. OpportunityBridge empowers users to report these barriers anonymously.
          </p>
        </div>
      </div>

      {/* How It Works List */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-6">
        <h3 className="text-2xl font-bold text-slate-900 font-outfit text-center">How OpportunityBridge Works</h3>

        <div className="space-y-4">
          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 mt-1">
              <FaCheckCircle />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-outfit">1. Centralized Opportunity Discovery</h4>
              <p className="text-xs text-slate-600 mt-1">
                Lecturers, industry partners, and administrators post verified scholarships, internships, workshops, and grants categorized by department.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 mt-1">
              <FaCheckCircle />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-outfit">2. Anonymous Barrier Reporting</h4>
              <p className="text-xs text-slate-600 mt-1">
                Students can report specific issues (awareness, equipment, transport, complex documents) anonymously or with their profile.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 mt-1">
              <FaCheckCircle />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 font-outfit">3. Administrative Resolution</h4>
              <p className="text-xs text-slate-600 mt-1">
                Faculty administrators review barrier reports, track status lifecycle (`Pending` → `Investigating` → `Resolved`), and provide official public updates.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
