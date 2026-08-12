import api from "./api";

// Initial fallback opportunities for University of Ruhuna FoT
const INITIAL_OPPORTUNITIES = [
  {
    _id: "opp_demo_1",
    title: "AI & Machine Learning Research Assistantship",
    description:
      "Join the Intelligent Systems Research Group at FoT Ruhuna working on NLP for Sri Lankan local languages and computer vision applications in agriculture.",
    category: "Research",
    department: "Department of Information & Communication Technology",
    location: "ICT Advanced Lab & Remote",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: ["Python / PyTorch proficiency", "3rd or 4th year FoT student", "Linear algebra background"],
    contactEmail: "dr.perera@fot.ruh.ac.lk",
    applicationUrl: "https://fot.ruh.ac.lk/research/ai-grant",
    tags: ["AI", "Python", "Research", "Deep Learning"],
    status: "Open",
    createdBy: { name: "Dr. K. L. Perera", email: "dr.perera@fot.ruh.ac.lk" },
  },
  {
    _id: "opp_demo_2",
    title: "IoT Smart Agriculture Embedded Systems Internship",
    description:
      "Industrial 6-month internship developing microcontroller-based sensor nodes for real-time soil moisture and environmental monitoring.",
    category: "Internship",
    department: "Department of Biosystems Technology",
    location: "Kamburupitiya Tech Campus & Field Sites",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: ["C/C++ Arduino & ESP32 programming", "Basic circuit design", "Biosystems or ET background"],
    contactEmail: "internships@fot.ruh.ac.lk",
    applicationUrl: "https://fot.ruh.ac.lk/careers/iot-intern",
    tags: ["IoT", "Embedded", "Biosystems", "Hardware"],
    status: "Open",
    createdBy: { name: "Dr. K. L. Perera", email: "dr.perera@fot.ruh.ac.lk" },
  },
  {
    _id: "opp_demo_3",
    title: "Cloud Architecture & Kubernetes Workshop",
    description:
      "A 2-day intensive practical workshop conducted by industry DevOps engineers covering Docker containerization, CI/CD pipelines, and AWS deployment.",
    category: "Workshop",
    department: "Department of Information & Communication Technology",
    location: "Auditorium & Virtual Lab",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: ["Basic Linux command line knowledge", "Personal laptop with Docker Desktop"],
    contactEmail: "devops-workshop@fot.ruh.ac.lk",
    applicationUrl: "https://fot.ruh.ac.lk/workshops/cloud",
    tags: ["Docker", "Kubernetes", "AWS", "DevOps"],
    status: "Open",
    createdBy: { name: "Faculty Admin", email: "admin@ruh.ac.lk" },
  },
  {
    _id: "opp_demo_4",
    title: "Faculty Undergraduate Technology Innovation Grant",
    description:
      "Seed funding of LKR 150,000 for innovative final year prototype projects in Robotics, Renewable Energy, and Smart Sensors.",
    category: "Scholarship",
    department: "Department of Engineering Technology",
    location: "Faculty Innovation Cell",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    requirements: ["Undergraduate FoT student group (2-4 members)", "Project proposal & budget plan"],
    contactEmail: "grants@fot.ruh.ac.lk",
    applicationUrl: "https://fot.ruh.ac.lk/grants/apply",
    tags: ["Grant", "Funding", "Robotics", "Innovation"],
    status: "Open",
    createdBy: { name: "Faculty Admin", email: "admin@ruh.ac.lk" },
  },
];

// Initial fallback barriers
const INITIAL_BARRIERS = [
  {
    _id: "bar_demo_1",
    title: "Screen Reader Incompatibility on Exam Registration Portal",
    description:
      "Visually impaired undergraduates are unable to register for semester end exams using NVDA screen readers due to missing ARIA labels.",
    category: "Digital / Web Accessibility",
    urgency: "High",
    location: "Online Exam Portal (fot.ruh.ac.lk/exams)",
    department: "Department of Information & Communication Technology",
    affectedGroup: "Visually Impaired Students",
    status: "In Review",
    adminNotes: "Assigned to Faculty IT team for ARIA audit.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "bar_demo_2",
    title: "Elevator Power Failure in Technology Building B",
    description:
      "Mobility impaired students cannot access upper floor computer laboratories due to elevator power faults.",
    category: "Physical / Infrastructure",
    urgency: "Critical",
    location: "Building B, 3rd Floor Labs",
    department: "Department of Engineering Technology",
    affectedGroup: "Students with Mobility Impairment",
    status: "Pending",
    adminNotes: "Maintenance ticket logged with Campus Electrical Engineer.",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const INITIAL_QUESTIONS = [
  {
    _id: "qa_demo_1",
    title: "How can I find part-time jobs near Matara?",
    content: "I am a 2nd year ICT student looking for flexible weekend or evening part-time work near Kamburupitiya or Matara city center to support my studies.",
    category: "Jobs & Gigs",
    tags: ["Matara", "Part-Time", "Jobs"],
    authorName: "Kasun Silva",
    authorRole: "student",
    authorDepartment: "Department of Information & Communication Technology",
    upvotes: 8,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    answers: [
      {
        _id: "ans_1",
        authorName: "Dr. K. L. Perera",
        authorRole: "provider",
        authorDepartment: "Department of Information & Communication Technology",
        content: "Check the OpportunityBridge jobs board filter for 'Jobs & Gigs'. Local IT firms near Matara software park frequently post weekend freelance roles.",
        upvotes: 5,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    _id: "qa_demo_2",
    title: "Which scholarships do not need an income certificate?",
    content: "Some government scholarships ask for Grama Niladhari income proof. Are there merit-based or faculty research grants open purely on GPA?",
    category: "Scholarships",
    tags: ["Scholarship", "Financial Aid", "GPA"],
    authorName: "Nipuna Deshan",
    authorRole: "student",
    authorDepartment: "Department of Engineering Technology",
    upvotes: 12,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    answers: [
      {
        _id: "ans_2",
        authorName: "Faculty Admin",
        authorRole: "admin",
        authorDepartment: "General",
        content: "The Faculty Innovation Grant and University Dean's Honor Roll Stipend do not require income certificates. They are awarded based on 1st & 2nd semester GPA.",
        upvotes: 9,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    _id: "qa_demo_3",
    title: "Are there weekend-only gigs for students?",
    content: "Looking for remote or local weekend assignments like web maintenance, graphic design, or lab equipment documentation.",
    category: "Jobs & Gigs",
    tags: ["Weekend", "Freelance", "Remote"],
    authorName: "Sunil Shantha",
    authorRole: "student",
    authorDepartment: "Department of Biosystems Technology",
    upvotes: 6,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    answers: [],
  },
];

const getStoredOpportunities = () => {
  const local = localStorage.getItem("local_opportunities");
  return local ? JSON.parse(local) : INITIAL_OPPORTUNITIES;
};

const getStoredBarriers = () => {
  const local = localStorage.getItem("local_barriers");
  return local ? JSON.parse(local) : INITIAL_BARRIERS;
};

const getStoredQuestions = () => {
  const local = localStorage.getItem("local_questions");
  return local ? JSON.parse(local) : INITIAL_QUESTIONS;
};

export const dataService = {
  // Opportunities API
  async getOpportunities(params = {}) {
    try {
      const { data } = await api.get("/opportunities", { params });
      if (Array.isArray(data)) return data;
    } catch (err) {
      console.warn("API unavailable, returning local storage opportunities:", err.message);
    }
    const list = getStoredOpportunities();
    return list.filter((item) => {
      if (params.category && params.category !== "All" && item.category !== params.category) return false;
      if (params.department && params.department !== "All" && item.department !== params.department) return false;
      if (params.search) {
        const query = params.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.tags?.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    });
  },

  async getOpportunityById(id) {
    try {
      const { data } = await api.get(`/opportunities/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn("API get by ID failed, trying local storage:", err.message);
    }
    const list = getStoredOpportunities();
    return list.find((o) => o._id === id || o.id === id);
  },

  async createOpportunity(oppData) {
    try {
      const { data } = await api.post("/opportunities", oppData);
      if (data) return data;
    } catch (err) {
      console.warn("API create opportunity error, saving locally:", err.message);
    }
    const list = getStoredOpportunities();
    const newOpp = {
      _id: "opp_local_" + Date.now(),
      ...oppData,
      createdAt: new Date().toISOString(),
      status: "Open",
    };
    list.unshift(newOpp);
    localStorage.setItem("local_opportunities", JSON.stringify(list));
    return newOpp;
  },

  async updateOpportunity(id, updateData) {
    try {
      const { data } = await api.put(`/opportunities/${id}`, updateData);
      if (data) return data;
    } catch (err) {
      console.warn("API update opportunity error:", err.message);
    }
    const list = getStoredOpportunities();
    const updated = list.map((o) => (o._id === id ? { ...o, ...updateData } : o));
    localStorage.setItem("local_opportunities", JSON.stringify(updated));
    return updated.find((o) => o._id === id);
  },

  async deleteOpportunity(id) {
    try {
      await api.delete(`/opportunities/${id}`);
    } catch (err) {
      console.warn("API delete opportunity error:", err.message);
    }
    const list = getStoredOpportunities();
    const updated = list.filter((o) => o._id !== id);
    localStorage.setItem("local_opportunities", JSON.stringify(updated));
    return true;
  },

  // Barrier Reports API
  async getBarriers(params = {}) {
    try {
      const { data } = await api.get("/barriers", { params });
      if (Array.isArray(data)) return data;
    } catch (err) {
      console.warn("API unavailable, returning local storage barriers:", err.message);
    }
    const list = getStoredBarriers();
    return list.filter((item) => {
      if (params.status && params.status !== "All" && item.status !== params.status) return false;
      if (params.category && params.category !== "All" && item.category !== params.category) return false;
      if (params.search) {
        const query = params.search.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        );
      }
      return true;
    });
  },

  async createBarrier(barrierData) {
    try {
      const { data } = await api.post("/barriers", barrierData);
      if (data) return data;
    } catch (err) {
      console.warn("API create barrier error, saving locally:", err.message);
    }
    const list = getStoredBarriers();
    const newBar = {
      _id: "bar_local_" + Date.now(),
      ...barrierData,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    list.unshift(newBar);
    localStorage.setItem("local_barriers", JSON.stringify(list));
    return newBar;
  },

  async updateBarrierStatus(id, updateData) {
    try {
      const { data } = await api.put(`/barriers/${id}`, updateData);
      if (data) return data;
    } catch (err) {
      console.warn("API update barrier status error:", err.message);
    }
    const list = getStoredBarriers();
    const updated = list.map((b) => (b._id === id ? { ...b, ...updateData } : b));
    localStorage.setItem("local_barriers", JSON.stringify(updated));
    return updated.find((b) => b._id === id);
  },

  async deleteBarrier(id) {
    try {
      await api.delete(`/barriers/${id}`);
    } catch (err) {
      console.warn("API delete barrier error:", err.message);
    }
    const list = getStoredBarriers();
    const updated = list.filter((b) => b._id !== id);
    localStorage.setItem("local_barriers", JSON.stringify(updated));
    return true;
  },

  // Community Q&A Board API
  async getQuestions(params = {}) {
    try {
      const { data } = await api.get("/qa", { params });
      if (Array.isArray(data)) return data;
    } catch (err) {
      console.warn("API unavailable, returning local questions:", err.message);
    }
    const list = getStoredQuestions();
    return list.filter((q) => {
      if (params.category && params.category !== "All" && q.category !== params.category) return false;
      if (params.search) {
        const query = params.search.toLowerCase();
        return (
          q.title.toLowerCase().includes(query) ||
          q.content.toLowerCase().includes(query) ||
          q.tags?.some((t) => t.toLowerCase().includes(query))
        );
      }
      return true;
    });
  },

  async createQuestion(questionData) {
    try {
      const { data } = await api.post("/qa", questionData);
      if (data) return data;
    } catch (err) {
      console.warn("API create question error, saving locally:", err.message);
    }
    const list = getStoredQuestions();
    const newQ = {
      _id: "qa_local_" + Date.now(),
      ...questionData,
      upvotes: 0,
      answers: [],
      createdAt: new Date().toISOString(),
    };
    list.unshift(newQ);
    localStorage.setItem("local_questions", JSON.stringify(list));
    return newQ;
  },

  async answerQuestion(id, answerData) {
    try {
      const { data } = await api.post(`/qa/${id}/answer`, answerData);
      if (data) return data;
    } catch (err) {
      console.warn("API answer question error:", err.message);
    }
    const list = getStoredQuestions();
    const updated = list.map((q) => {
      if (q._id === id) {
        const answers = q.answers || [];
        answers.push({
          _id: "ans_local_" + Date.now(),
          ...answerData,
          upvotes: 0,
          createdAt: new Date().toISOString(),
        });
        return { ...q, answers };
      }
      return q;
    });
    localStorage.setItem("local_questions", JSON.stringify(updated));
    return updated.find((q) => q._id === id);
  },

  async upvoteQuestion(id) {
    try {
      const { data } = await api.put(`/qa/${id}/upvote`);
      if (data) return data;
    } catch (err) {
      console.warn("API upvote error:", err.message);
    }
    const list = getStoredQuestions();
    const updated = list.map((q) => (q._id === id ? { ...q, upvotes: (q.upvotes || 0) + 1 } : q));
    localStorage.setItem("local_questions", JSON.stringify(updated));
    return updated.find((q) => q._id === id);
  },

  async deleteQuestion(id) {
    try {
      await api.delete(`/qa/${id}`);
    } catch (err) {
      console.warn("API delete question error:", err.message);
    }
    const list = getStoredQuestions();
    const updated = list.filter((q) => q._id !== id);
    localStorage.setItem("local_questions", JSON.stringify(updated));
    return true;
  },

  // Analytics Overview
  async getAnalytics() {
    try {
      const { data } = await api.get("/barriers/analytics/overview");
      if (data && data.summary) return data;
    } catch (err) {
      console.warn("API analytics error, compiling local metrics:", err.message);
    }

    const opps = getStoredOpportunities();
    const bars = getStoredBarriers();

    const categoryMap = {};
    bars.forEach((b) => {
      categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
    });

    const urgencyMap = {};
    bars.forEach((b) => {
      urgencyMap[b.urgency] = (urgencyMap[b.urgency] || 0) + 1;
    });

    const deptMap = {};
    opps.forEach((o) => {
      deptMap[o.department] = (deptMap[o.department] || 0) + 1;
    });

    return {
      summary: {
        totalUsers: 14,
        totalOpportunities: opps.length,
        openOpportunities: opps.filter((o) => o.status === "Open").length,
        totalBarriers: bars.length,
        pendingBarriers: bars.filter((b) => b.status === "Pending").length,
        inReviewBarriers: bars.filter((b) => b.status === "In Review").length,
        resolvedBarriers: bars.filter((b) => b.status === "Resolved").length,
      },
      categoryStats: Object.keys(categoryMap).map((k) => ({ _id: k, count: categoryMap[k] })),
      urgencyStats: Object.keys(urgencyMap).map((k) => ({ _id: k, count: urgencyMap[k] })),
      oppDepartmentStats: Object.keys(deptMap).map((k) => ({ _id: k, count: deptMap[k] })),
    };
  },
};
