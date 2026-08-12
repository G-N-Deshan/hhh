import React from "react";
import { Link } from "react-router-dom";
import { FaGraduationCap, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-700">
                <FaGraduationCap className="text-amber-400 w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-slate-900 font-outfit">
                Opportunity<span className="text-amber-600">Bridge</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Connecting faculty opportunities with students at Faculty of Technology, University of Ruhuna. Bridging access to academic, career, and welfare support.
            </p>
          </div>

          {/* Column 2: Quick Links (Includes About & Q&A Board) */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
              Quick Links & Resources
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-blue-600 transition-colors">Opportunities</Link>
              </li>
              <li>
                <Link to="/report-barrier" className="hover:text-rose-600 transition-colors">Report Barrier</Link>
              </li>
              <li>
                <Link to="/qa" className="hover:text-indigo-600 font-bold text-indigo-700 transition-colors">
                  Community Q&A Board
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-600 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-600 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-600 transition-colors">Register Account</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
              Opportunity Categories
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/opportunities?category=Scholarships" className="hover:text-blue-600 transition-colors">Scholarships</Link>
              </li>
              <li>
                <Link to="/opportunities?category=Internships" className="hover:text-blue-600 transition-colors">Internships</Link>
              </li>
              <li>
                <Link to="/opportunities?category=Jobs" className="hover:text-blue-600 transition-colors">Jobs & Gigs</Link>
              </li>
              <li>
                <Link to="/opportunities?category=Training" className="hover:text-blue-600 transition-colors">Training Programs</Link>
              </li>
              <li>
                <Link to="/opportunities?category=Financial+Support" className="hover:text-blue-600 transition-colors">Financial Support</Link>
              </li>
              <li>
                <Link to="/opportunities?category=Mental+Health" className="hover:text-blue-600 transition-colors">Mental Health Support</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 font-outfit">
              Contact Faculty
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start space-x-2">
                <FaMapMarkerAlt className="text-amber-600 flex-shrink-0 mt-0.5" />
                <span>Faculty of Technology, University of Ruhuna, Karagoda-Uyangoda, Kamburupitiya, Sri Lanka</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaEnvelope className="text-rose-600 flex-shrink-0" />
                <span>info@fot.ruh.ac.lk</span>
              </li>
              <li className="flex items-center space-x-2">
                <FaPhone className="text-emerald-600 flex-shrink-0" />
                <span>+94 (0)41 2292200</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} OpportunityBridge • Faculty of Technology, University of Ruhuna.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link to="/about" className="hover:underline">About</Link>
            <Link to="/qa" className="hover:underline">Q&A Board</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
