import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { dataService } from "../services/dataService";
import toast from "react-hot-toast";
import { CardSkeleton } from "../components/SkeletonLoader";
import {
  FaQuestionCircle,
  FaPlus,
  FaSearch,
  FaThumbsUp,
  FaCommentDots,
  FaUser,
  FaGraduationCap,
  FaTag,
  FaTrash,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

export default function QA() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Question Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState("General");
  const [newTags, setNewTags] = useState("");
  const [submittingQuestion, setSubmittingQuestion] = useState(false);

  // Expandable Answer Form State
  const [expandedQuestionId, setExpandedQuestionId] = useState(null);
  const [answerContentMap, setAnswerContentMap] = useState({});
  const [submittingAnswerMap, setSubmittingAnswerMap] = useState({});

  const categories = [
    "All",
    "Scholarships",
    "Jobs & Gigs",
    "Internships",
    "Access & Barrier",
    "General",
  ];

  const fetchQuestions = async () => {
    setLoading(true);
    const data = await dataService.getQuestions({
      category: selectedCategory,
      search: searchQuery,
    });
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedCategory, searchQuery]);

  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to ask a question");
      return;
    }
    if (!newTitle.trim() || !newContent.trim()) {
      toast.error("Please fill in both title and question content");
      return;
    }

    setSubmittingQuestion(true);
    const res = await dataService.createQuestion({
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : [],
      authorName: user.name,
      authorRole: user.role,
      authorDepartment: user.department || "General",
    });

    setSubmittingQuestion(false);
    if (res) {
      toast.success("Question posted to Community Board!");
      setModalOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewTags("");
      fetchQuestions();
    }
  };

  const handleUpvoteQuestion = async (questionId) => {
    if (!user) {
      toast.error("Please sign in to upvote questions");
      return;
    }
    const updated = await dataService.upvoteQuestion(questionId);
    if (updated) {
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === questionId ? { ...q, upvotes: updated.upvotes || (q.upvotes || 0) + 1 } : q
        )
      );
      toast.success("Upvoted!");
    }
  };

  const handleAddAnswer = async (e, questionId) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to answer questions");
      return;
    }
    const content = answerContentMap[questionId];
    if (!content || !content.trim()) {
      toast.error("Answer content cannot be empty");
      return;
    }

    setSubmittingAnswerMap((prev) => ({ ...prev, [questionId]: true }));
    const updated = await dataService.answerQuestion(questionId, {
      content: content.trim(),
      authorName: user.name,
      authorRole: user.role,
      authorDepartment: user.department || "General",
    });

    setSubmittingAnswerMap((prev) => ({ ...prev, [questionId]: false }));
    if (updated) {
      toast.success("Answer posted!");
      setAnswerContentMap((prev) => ({ ...prev, [questionId]: "" }));
      fetchQuestions();
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm("Are you sure you want to delete this question?")) return;
    const success = await dataService.deleteQuestion(questionId);
    if (success) {
      toast.success("Question deleted");
      setQuestions((prev) => prev.filter((q) => q._id !== questionId));
    }
  };

  const toggleExpandQuestion = (id) => {
    setExpandedQuestionId(expandedQuestionId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold">
              <FaQuestionCircle className="w-3.5 h-3.5" />
              <span>Option 3 • Community Q&A Board</span>
            </div>
            <h1 className="text-3xl font-bold font-outfit tracking-tight">
              Community Q&A Board
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              A dedicated question-and-answer space for undergraduates, lecturers, volunteers, and faculty admins to share guidance and solve academic or access barriers together.
            </p>
          </div>

          <button
            onClick={() => {
              if (!user) {
                toast.error("Please sign in to ask a question");
                return;
              }
              setModalOpen(true);
            }}
            className="self-start md:self-center py-3.5 px-6 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm shadow-lg shadow-blue-500/30 transition-all font-outfit flex items-center space-x-2 cursor-pointer group shrink-0"
          >
            <FaPlus className="group-hover:rotate-90 transition-transform" />
            <span>Ask a Question</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <FaSearch className="absolute left-3.5 top-3.5 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search Q&A questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all font-outfit cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Question Feed */}
      {loading ? (
        <CardSkeleton count={4} />
      ) : questions.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
            <FaQuestionCircle />
          </div>
          <h3 className="text-lg font-bold text-slate-800 font-outfit">No Questions Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Be the first to ask a question about scholarships, jobs, or campus access!
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl font-outfit inline-flex items-center space-x-2"
          >
            <FaPlus />
            <span>Ask First Question</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const isExpanded = expandedQuestionId === q._id;
            const answerCount = q.answers ? q.answers.length : 0;

            return (
              <div
                key={q._id}
                className="glass-panel p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition-all"
              >
                {/* Header Info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                        {q.category}
                      </span>
                      <span className="text-[11px] text-slate-400">•</span>
                      <span className="text-xs font-medium text-slate-600 flex items-center space-x-1">
                        <FaUser className="text-slate-400 text-[10px]" />
                        <span>{q.authorName || q.author?.name || "Anonymous Student"}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold uppercase tracking-wider">
                        {q.authorRole || q.author?.role || "student"}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 font-outfit hover:text-blue-600 transition-colors cursor-pointer" onClick={() => toggleExpandQuestion(q._id)}>
                      {q.title}
                    </h2>
                  </div>

                  {/* Upvote & Delete Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpvoteQuestion(q._id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer"
                    >
                      <FaThumbsUp className="text-xs" />
                      <span>{q.upvotes || 0}</span>
                    </button>

                    {(user?.role === "admin" || user?._id === q.author?._id || user?._id === q.author) && (
                      <button
                        onClick={() => handleDeleteQuestion(q._id)}
                        className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
                        title="Delete Question"
                      >
                        <FaTrash className="text-xs" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content Body */}
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {q.content}
                </p>

                {/* Tags & Answer Toggle Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    {q.tags &&
                      q.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono flex items-center space-x-1">
                          <FaTag className="text-[9px] text-slate-400" />
                          <span>{tag}</span>
                        </span>
                      ))}
                  </div>

                  <button
                    onClick={() => toggleExpandQuestion(q._id)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center space-x-1.5 cursor-pointer"
                  >
                    <FaCommentDots />
                    <span>{answerCount} {answerCount === 1 ? "Answer" : "Answers"}</span>
                    {isExpanded ? <FaChevronUp className="text-[10px]" /> : <FaChevronDown className="text-[10px]" />}
                  </button>
                </div>

                {/* Expanded Answers & Input Section */}
                {isExpanded && (
                  <div className="pt-4 space-y-4 border-t border-slate-100 animate-fadeIn">
                    
                    {/* List of Existing Answers */}
                    {q.answers && q.answers.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                          Community Answers ({q.answers.length}):
                        </h4>
                        {q.answers.map((ans, idx) => (
                          <div key={ans._id || idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center space-x-2">
                                <span className="font-bold text-slate-900">{ans.authorName}</span>
                                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
                                  {ans.authorRole}
                                </span>
                                <span className="text-[10px] text-slate-400">• {ans.authorDepartment}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {new Date(ans.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed font-sans">
                              {ans.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        No answers posted yet. Be the first student or lecturer to answer!
                      </p>
                    )}

                    {/* Submit New Answer Input */}
                    <form onSubmit={(e) => handleAddAnswer(e, q._id)} className="space-y-2 pt-2">
                      <textarea
                        rows="2"
                        required
                        placeholder="Write your answer or guidance for the community..."
                        value={answerContentMap[q._id] || ""}
                        onChange={(e) =>
                          setAnswerContentMap((prev) => ({ ...prev, [q._id]: e.target.value }))
                        }
                        className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                      ></textarea>
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingAnswerMap[q._id]}
                          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl font-outfit flex items-center space-x-1.5 cursor-pointer shadow-sm"
                        >
                          <FaCheckCircle className="text-xs" />
                          <span>{submittingAnswerMap[q._id] ? "Posting..." : "Post Answer"}</span>
                        </button>
                      </div>
                    </form>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* CREATE QUESTION MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 rounded-3xl border border-slate-200 bg-white space-y-5 shadow-2xl relative">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FaQuestionCircle className="text-blue-600 text-lg" />
                <h3 className="text-lg font-bold text-slate-900 font-outfit">Ask Community Question</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Question Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. How can I find part-time jobs near Matara?"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-outfit"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Scholarships">Scholarships</option>
                  <option value="Jobs & Gigs">Jobs & Gigs</option>
                  <option value="Internships">Internships</option>
                  <option value="Access & Barrier">Access & Barrier</option>
                  <option value="General">General</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Detailed Question / Context *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide background context or specific details about your question..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-3 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Tags (Comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Matara, Part-Time, GPA"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold font-outfit"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingQuestion}
                  className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl font-outfit shadow-md flex items-center space-x-2 cursor-pointer"
                >
                  <FaPlus />
                  <span>{submittingQuestion ? "Posting..." : "Post Question"}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
