import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to Administration.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setSubmitting(false);
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-8">
      
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 font-outfit">Contact Us</h1>
        <p className="text-sm text-slate-600">
          We're here to answer questions and support your path to new opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Information Cards */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
            <FaMapMarkerAlt className="text-amber-600 text-xl" />
            <h3 className="text-sm font-bold text-slate-900 font-outfit">Our Location</h3>
            <p className="text-xs text-slate-600">
              123 Community Hub Street, Colombo, Sri Lanka
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
            <FaEnvelope className="text-rose-600 text-xl" />
            <h3 className="text-sm font-bold text-slate-900 font-outfit">Email Support</h3>
            <p className="text-xs text-slate-600">
              info@opportunitybridge.org / support@opportunitybridge.org
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
            <FaPhone className="text-emerald-600 text-xl" />
            <h3 className="text-sm font-bold text-slate-900 font-outfit">General Phone</h3>
            <p className="text-xs text-slate-600">
              +94 (0)11 2345678 / +94 (0)11 2345679
            </p>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="md:col-span-2 glass-panel p-8 rounded-3xl border border-slate-200 bg-white space-y-4">
          <h3 className="text-xl font-bold text-slate-900 font-outfit">Send Us a Message</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Inquiry regarding scholarship opportunities"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">Message *</label>
              <textarea
                rows={4}
                required
                placeholder="Write your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white text-slate-900 px-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-500 focus:outline-none text-sm"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all font-outfit flex items-center space-x-2"
            >
              <FaPaperPlane />
              <span>{submitting ? "Sending..." : "Send Message"}</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}