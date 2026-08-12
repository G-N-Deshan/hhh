import api from "./api";

// 100+ Sample Opportunities across 10 Categories (10 items each) for Faculty of Technology, University of Ruhuna
const generateInitialOpportunities = () => {
  const dataset = [];
  let idCounter = 1;

  const categories = [
    {
      name: "Scholarships",
      titles: [
        "Faculty Dean's Academic Merit Scholarship 2026",
        "Ceylon Chamber STEM Undergraduate Grant",
        "Women in ICT Leadership Fellowship",
        "Mahapola Higher Education Bursary Supplement",
        "Biosystems Research Innovation Grant 2026",
        "Dialog Axiata Digital Technology Scholarship",
        "Alumni Association Hardship Support Grant",
        "SLT-MOBITEL Cloud Engineering Bursary",
        "Green Technology Sustainable Energy Scholarship",
        "Japanese Language & Tech Exchange Fellowship",
      ],
    },
    {
      name: "Internships",
      titles: [
        "Full-Stack Software Engineering Intern - Virtusa",
        "Embedded IoT & Smart Sensors Intern - Dialog",
        "Data Science & Python ML Intern - WSO2",
        "Post-Harvest Quality Control Trainee - FoodTech",
        "QA Automation Engineering Intern - Sysco LABS",
        "CAD Modeling & Mechanical Draftsperson - DSI",
        "Cyber Security SOC Network Defense Intern - SLT",
        "Plant Tissue Culture Trainee - Agri Dept",
        "UI/UX & Mobile App Design Intern - Zone24x7",
        "Robotics & Automation PLC Trainee - Lalan",
      ],
    },
    {
      name: "Jobs",
      titles: [
        "Part-Time IT Lab Technical Assistant - FoT",
        "Freelance React & Node.js Developer (Part-Time)",
        "Equipment Maintenance Assistant - ET Department",
        "Junior WordPress Developer & Site Maintainer",
        "Soil Testing & Agri Sample Field Collector",
        "Campus Library Digital Cataloguer",
        "Graphic Designer & Social Media Creator",
        "3D Printing & Laser Cutter Operator - FoT Cell",
        "Weekend Computer Hardware Repair Technician",
        "Smart Greenhouse Operations Assistant",
      ],
    },
    {
      name: "Training",
      titles: [
        "Kubernetes & Cloud DevOps Intensive Bootcamp",
        "Ethical Hacking & Web Pen-Testing Masterclass",
        "Microcontroller PCB Design & Soldering Training",
        "Deep Learning with PyTorch & Computer Vision",
        "Food Safety HACCP Certification Course",
        "React Native Mobile App Workshop",
        "Industrial Automation & PLC Ladder Logic",
        "GIS & Satellite Remote Sensing Analysis",
        "Technical Writing & IEEE Paper Preparation",
        "Agile Scrum Master & Jira Training",
      ],
    },
    {
      name: "Financial Support",
      titles: [
        "Student Laptop Purchasing Loan Interest Subsidy",
        "Emergency Medical & Surgical Assistance Fund",
        "Final Year Prototype Component Fabrication Grant",
        "Semester Examination Fee Exemption Waiver",
        "Subsidized Canteen Meal Ticket Voucher Scheme",
        "Disability Assistive Technology Equipment Subsidy",
        "Research Conference Paper Registration Grant",
        "Temporary Hostel Fee Relief Grant",
        "Software Tool & Cloud Credits Voucher (AWS/JetBrains)",
        "Student Startup Seed Capital Micro-Grant",
      ],
    },
    {
      name: "Mental Health",
      titles: [
        "Campus Confidential Counseling & Wellness Sessions",
        "Mindfulness & Exam Stress Relief Workshop",
        "Peer Mental Health Support Group & Buddy Network",
        "24/7 Crisis Hotline & Remote Emotional Support",
        "Sleep Hygiene & Screen Fatigue Clinic",
        "Art Therapy & Creative Expression Workshop",
        "Overcoming Imposter Syndrome in Tech Panel",
        "Yoga & Physical Movement for Posture Relief",
        "Work-Life Balance & Time Management Masterclass",
        "Inclusive Group Support for Differently Abled Students",
      ],
    },
    {
      name: "Accommodation",
      titles: [
        "Subsidized On-Campus University Hostel Allocation",
        "Wheelchair Accessible Ground Floor Boarding House",
        "Shared Female Tech Student House near Campus",
        "Quiet Study Boarding for Final Year Thesis Students",
        "Matara City Shared Flat (Near Railway Station)",
        "Low-Cost Subsidized Rooms for Mahapola Students",
        "Male Engineering Tech Student Boarding Annex",
        "Short-Term Exam Season Guest Accommodation",
        "Eco-Friendly Boarding with Solar Power",
        "Emergency Temporary Shelter for Stranded Students",
      ],
    },
    {
      name: "Transport",
      titles: [
        "Campus Shuttle Bus (Matara Station <-> FoT Campus)",
        "Wheelchair Accessible Van Transport Scheme",
        "Subsidized Sri Lanka CTB Student Bus Pass",
        "Campus Bicycle Sharing & Rental Scheme",
        "Late Night Exam Carpool & Security Escort",
        "Inter-Campus Express Bus (Wellamadama <-> FoT)",
        "Student Railway Commuter Discount Concession Card",
        "Electric Scooter Charging Stations & Parking",
        "Rainy Season Golf Cart Shuttle Service",
        "Field Trip & Industrial Visit Bus Grant",
      ],
    },
    {
      name: "Events",
      titles: [
        "Technovate 2026 - Annual Technology Innovation Hackathon",
        "Robofest Ruhuna 2026 Robotics Championship",
        "FoT Annual Industrial Career Fair 2026",
        "International Research Symposium on Technology (IRST)",
        "Smart Agriculture & Agri-Tech Exhibition 2026",
        "Cyber Security CTF (Capture The Flag) Contest",
        "Faculty Cultural Night & Musical Extravaganza",
        "FoT Inter-Departmental Sports & Esports League",
        "Open Source Software Day & Linux Install-Fest",
        "Faculty Alumni Tech Talk & Panel Discussion",
      ],
    },
    {
      name: "Volunteering",
      titles: [
        "Rural School Computer Literacy Volunteer Mentor",
        "Visually Impaired Audio Book Reader & Converter",
        "Matara Coastal & Beach Plastic Clean-Up Drive",
        "Campus Green Eco-Tech Tree Planting Volunteer",
        "Blood Donation Camp Volunteer Organizer",
        "Disaster Emergency Relief Coordinator",
        "Elderly Home Tech Helper & Smartphone Coach",
        "Animal Welfare & Stray Dog Vaccination Drive",
        "Youth STEM Workshop Facilitator for School Students",
        "Campus Access Barrier Survey & ARIA Auditor",
      ],
    },
  ];

  const depts = [
    "Department of Information & Communication Technology",
    "Department of Engineering Technology",
    "Department of Biosystems Technology",
    "All Departments",
  ];

  categories.forEach((cat) => {
    cat.titles.forEach((title, idx) => {
      dataset.push({
        _id: `opp_demo_${idCounter++}`,
        title,
        description: `Official Opportunity Bridge listing for ${title} under the ${cat.name} section for Faculty of Technology, University of Ruhuna undergraduates.`,
        category: cat.name,
        department: depts[idx % depts.length],
        location: idx % 2 === 0 ? "Kamburupitiya Tech Campus" : "Matara / Remote",
        deadline: new Date(Date.now() + (15 + idx * 3) * 24 * 60 * 60 * 1000).toISOString(),
        requirements: ["Registered FoT Student", "Application form submission"],
        contactEmail: "info@fot.ruh.ac.lk",
        applicationUrl: "https://fot.ruh.ac.lk/apply",
        tags: [cat.name, "FoT Ruhuna", "2026"],
        status: "Open",
        createdBy: { name: "Faculty Admin", email: "admin@ruh.ac.lk" },
        createdAt: new Date(Date.now() - idx * 24 * 60 * 60 * 1000).toISOString(),
      });
    });
  });

  return dataset;
};

const INITIAL_OPPORTUNITIES = generateInitialOpportunities();

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
    answers: [],
  },
];

const getStoredOpportunities = () => {
  const local = localStorage.getItem("local_opportunities");
  const parsed = local ? JSON.parse(local) : [];
  return parsed.length >= 20 ? parsed : INITIAL_OPPORTUNITIES;
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
    let list = [];
    try {
      const { data } = await api.get("/opportunities", { params });
      if (Array.isArray(data) && data.length > 0) {
        list = data;
      }
    } catch (err) {
      console.warn("API unavailable, returning local sample opportunities:", err.message);
    }

    if (list.length === 0) {
      list = getStoredOpportunities();
    }

    return list.filter((item) => {
      if (params.category && params.category !== "All") {
        const catClean = params.category.toLowerCase().replace("& gigs", "").replace("gigs", "").trim();
        const itemCatClean = (item.category || "").toLowerCase();
        if (!itemCatClean.includes(catClean) && !catClean.includes(itemCatClean)) return false;
      }
      if (params.department && params.department !== "All" && item.department !== params.department) return false;
      if (params.search || params.keyword) {
        const query = (params.search || params.keyword).toLowerCase();
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

  async applyOpportunity(id, applicationData) {
    try {
      const { data } = await api.post(`/opportunities/${id}/apply`, applicationData);
      if (data) return data;
    } catch (err) {
      console.warn("API apply opportunity error, saving locally:", err.message);
    }
    const localApps = JSON.parse(localStorage.getItem("local_applications") || "[]");
    const newApp = {
      _id: "app_local_" + Date.now(),
      opportunityId: id,
      ...applicationData,
      createdAt: new Date().toISOString(),
      status: "Submitted",
    };
    localApps.unshift(newApp);
    localStorage.setItem("local_applications", JSON.stringify(localApps));
    return newApp;
  },

  async toggleSaveOpportunity(id) {
    let savedList = JSON.parse(localStorage.getItem("local_wishlist") || "[]");
    const targetIdStr = (id || "").toString();
    if (savedList.includes(targetIdStr)) {
      savedList = savedList.filter((item) => item !== targetIdStr);
    } else {
      savedList.push(targetIdStr);
    }
    localStorage.setItem("local_wishlist", JSON.stringify(savedList));

    try {
      const { data } = await api.put(`/auth/bookmark/${id}`);
      if (data) return data;
    } catch (err) {
      console.warn("API save opportunity error:", err.message);
    }
    return { savedOpportunities: savedList };
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

  // Opportunity Review System
  async addOpportunityReview(id, reviewData) {
    try {
      const { data } = await api.post(`/opportunities/${id}/reviews`, reviewData);
      if (data) return data;
    } catch (err) {
      console.warn("API add opportunity review error, saving locally:", err.message);
    }
    const list = getStoredOpportunities();
    const target = list.find((o) => o._id === id || o.id === id);
    if (target) {
      target.reviews = target.reviews || [];
      const newRev = {
        _id: "rev_local_" + Date.now(),
        ...reviewData,
        createdAt: new Date().toISOString(),
      };
      target.reviews.push(newRev);
      target.numReviews = target.reviews.length;
      target.averageRating =
        target.reviews.reduce((acc, item) => item.rating + acc, 0) / target.reviews.length;

      localStorage.setItem("local_opportunities", JSON.stringify(list));
      return { message: "Review added", opportunity: target };
    }
  },

  // Site Platform Review System
  async getSiteReviews() {
    try {
      const { data } = await api.get("/site-reviews");
      if (data) return data;
    } catch (err) {
      console.warn("API get site reviews error, returning local dataset:", err.message);
    }
    const local = JSON.parse(localStorage.getItem("local_site_reviews") || "[]");
    if (local.length === 0) {
      const initialSiteReviews = [
        {
          _id: "srev_1",
          userName: "Kasun Silva",
          userRole: "student",
          userDepartment: "Department of Engineering Technology",
          rating: 5,
          title: "Incredible Faculty Resource Platform!",
          comment: "OpportunityBridge helped me secure an embedded systems internship at Dialog Axiata. Highly recommended for all FoT undergraduates!",
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          _id: "srev_2",
          userName: "Nipuna Deshan",
          userRole: "student",
          userDepartment: "Department of Information & Communication Technology",
          rating: 5,
          title: "Great Barrier Reporting & Accessibility",
          comment: "Reporting physical & website accessibility issues is super fast. The Dean's office responded to my exam portal barrier report within 2 days.",
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      return { reviews: initialSiteReviews, total: 2, averageRating: 5.0 };
    }
    const total = local.length;
    const avg = total > 0 ? local.reduce((a, b) => a + b.rating, 0) / total : 5.0;
    return { reviews: local, total, averageRating: parseFloat(avg.toFixed(1)) };
  },

  async createSiteReview(reviewData) {
    try {
      const { data } = await api.post("/site-reviews", reviewData);
      if (data) return data;
    } catch (err) {
      console.warn("API create site review error, saving locally:", err.message);
    }
    const local = JSON.parse(localStorage.getItem("local_site_reviews") || "[]");
    const newRev = {
      _id: "srev_local_" + Date.now(),
      ...reviewData,
      createdAt: new Date().toISOString(),
    };
    local.unshift(newRev);
    localStorage.setItem("local_site_reviews", JSON.stringify(local));
    return newRev;
  },
};
