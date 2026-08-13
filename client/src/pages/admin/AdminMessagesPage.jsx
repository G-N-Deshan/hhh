import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { dataService } from "../../services/dataService";
import Loader from "../../components/Loader";
import {
  FaEnvelope,
  FaSearch,
  FaFilter,
  FaTrash,
  FaReply,
  FaCheckDouble,
  FaClock,
  FaUser,
} from "react-icons/fa";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Reply Modal State
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [newStatus, setNewStatus] = useState("Read");
  const [newResponse, setNewResponse] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await dataService.getContactMessages();
      setMessages(data || []);
    } catch (err) {
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleOpenReplyModal = (msg) => {
    setSelectedMsg(msg);
    setNewStatus(msg.status === "Unread" ? "Read" : msg.status);
    setNewResponse(msg.adminResponse || "");
  };

  const handleSaveResponse = async (e) => {
    e.preventDefault();
    if (!selectedMsg) return;

    setUpdating(true);
    const res = await dataService.updateContactStatus(selectedMsg._id, {
      status: newResponse.trim() ? "Replied" : newStatus,
      adminResponse: newResponse.trim(),
    });
    setUpdating(false);

    if (res) {
      toast.success("Contact message response updated!");
      setSelectedMsg(null);
      fetchMessages();
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact message?")) {
      await dataService.deleteContactMessage(id);
      toast.success("Message deleted");
      fetchMessages();
    }
  };

  const filteredMessages = messages.filter((msg) => {
    if (statusFilter !== "All" && msg.status !== statusFilter) return false;
    if (!search) return true;
    const query = search.toLowerCase();
    return (
      (msg.name || "").toLowerCase().includes(query) ||
      (msg.email || "").toLowerCase().includes(query) ||
      (msg.subject || "").toLowerCase().includes(query) ||
      (msg.message || "").toLowerCase().includes(query)
    );
  });

  if (loading) return <Loader text="Loading contact messages..." />;

  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-outfit flex items-center space-x-2">
            <FaEnvelope className="text-rose-600" />
            <span>Contact Support Messages & Notifications</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time messages sent by students and visitors via the website Contact form.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold font-mono">
          {unreadCount > 0 && (
            <span className="px-3 py-1.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
              {unreadCount} Unread Messages
            </span>
          )}
          <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            Total: {messages.length}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <FaSearch className="absolute left-3.5 top-3 text-slate-400 text-xs" />
          <input
            type="text"
            placeholder="Search by sender name, email, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 pl-10 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-rose-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["All", "Unread", "Read", "Replied"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === st
                  ? "bg-rose-600 text-white font-outfit shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Message Cards List */}
      {filteredMessages.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
          <FaEnvelope className="text-slate-300 text-3xl mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 font-outfit">No Messages Found</h3>
          <p className="text-xs text-slate-500">Contact form messages submitted by users will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg._id}
              className={`glass-panel p-6 rounded-2xl bg-white border space-y-3 transition-all ${
                msg.status === "Unread"
                  ? "border-rose-300 shadow-md ring-1 ring-rose-200"
                  : "border-slate-200 shadow-sm"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-base font-outfit">{msg.subject || "General Inquiry"}</span>
                    {msg.status === "Unread" && (
                      <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                        NEW UNREAD
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    Sent by: <span className="font-bold text-slate-800">{msg.name}</span> ({msg.email}) • {new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                  msg.status === "Replied"
                    ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                    : msg.status === "Read"
                    ? "bg-slate-100 text-slate-700 border-slate-200"
                    : "bg-rose-100 text-rose-800 border-rose-300"
                }`}>
                  {msg.status}
                </span>
              </div>

              {/* Message Content */}
              <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-800 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase font-mono block">User Message</span>
                <p className="leading-relaxed font-sans">{msg.message}</p>
              </div>

              {msg.adminResponse && (
                <div className="p-4 bg-blue-50/60 rounded-xl text-xs text-blue-950 border border-blue-200 space-y-1">
                  <span className="text-[10px] font-bold text-blue-800 uppercase font-mono block">Admin Response Sent</span>
                  <p>{msg.adminResponse}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenReplyModal(msg)}
                  className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center space-x-1.5 cursor-pointer font-outfit"
                >
                  <FaReply />
                  <span>{msg.adminResponse ? "Edit Reply" : "Reply / Mark Status"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(msg._id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs cursor-pointer"
                  title="Delete Message"
                >
                  <FaTrash />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* REPLY MODAL */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base font-outfit flex items-center space-x-2">
                <FaReply className="text-rose-600" />
                <span>Respond to Contact Inquiry</span>
              </h3>
              <button
                type="button"
                onClick={() => setSelectedMsg(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveResponse} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                <span className="text-slate-400 block text-[10px] uppercase font-mono">From</span>
                <span className="font-bold text-slate-900">{selectedMsg.name} ({selectedMsg.email})</span>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Message Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                >
                  <option value="Unread">Unread</option>
                  <option value="Read">Read</option>
                  <option value="Replied">Replied</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Admin Response Note to User
                </label>
                <textarea
                  rows="3"
                  placeholder="Type official faculty response or resolution notes here..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:bg-white focus:border-rose-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMsg(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold font-outfit cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs font-outfit shadow-md cursor-pointer"
                >
                  {updating ? "Saving..." : "Save Response"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
