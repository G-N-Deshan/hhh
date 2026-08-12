const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const BarrierReport = require("../models/BarrierReport");
const Question = require("../models/Question");

const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding initial Faculty of Technology data...");

      // Create Default Users
      const admin = await User.create({
        name: "Faculty Admin",
        email: "admin@ruh.ac.lk",
        password: "Admin@123",
        role: "admin",
        department: "General",
        bio: "Dean & IT System Administrator - Faculty of Technology, University of Ruhuna",
      });

      const lecturer = await User.create({
        name: "Dr. K. L. Perera",
        email: "dr.perera@fot.ruh.ac.lk",
        password: "Lecturer@123",
        role: "provider",
        department: "Department of Information & Communication Technology",
        bio: "Senior Lecturer in Cyber Security and Software Engineering",
      });

      const student = await User.create({
        name: "Kasun Silva",
        email: "tech.student@fot.ruh.ac.lk",
        password: "Student@123",
        role: "student",
        department: "Department of Engineering Technology",
        bio: "3rd Year Undergraduate in Engineering Technology (Robotics)",
      });

      // Create Default Opportunities
      const opportunities = [
        {
          title: "AI & Machine Learning Research Assistantship",
          description:
            "Join the Intelligent Systems Research Group at FoT Ruhuna working on NLP for Sri Lankan local languages and computer vision applications in agriculture.",
          category: "Research",
          department: "Department of Information & Communication Technology",
          location: "ICT Advanced Lab & Remote",
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
          requirements: [
            "Python / PyTorch proficiency",
            "3rd or 4th year FoT student",
            "Strong background in linear algebra",
          ],
          contactEmail: "dr.perera@fot.ruh.ac.lk",
          applicationUrl: "https://fot.ruh.ac.lk/research/ai-grant",
          tags: ["AI", "Python", "Research", "Deep Learning"],
          postedBy: lecturer._id,
          postedByName: lecturer.name,
        },
        {
          title: "Full-Stack Web Engineering Internship 2026",
          description:
            "6-month paid industrial internship for ICT & ET undergraduates with leading Colombo tech firms.",
          category: "Internships",
          department: "Department of Information & Communication Technology",
          location: "Colombo / Hybrid",
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          requirements: ["React, Node.js, MongoDB", "Good communication skills"],
          contactEmail: "careers@fot.ruh.ac.lk",
          applicationUrl: "https://fot.ruh.ac.lk/careers/internship2026",
          tags: ["MERN", "React", "Node.js", "Paid Internship"],
          postedBy: lecturer._id,
          postedByName: lecturer.name,
        },
      ];

      await Opportunity.insertMany(opportunities);

      // Create Default Barrier Reports
      const barriers = [
        {
          title: "Screen Reader Incompatibility on Exam Registration Portal",
          description:
            "Visually impaired undergraduates are unable to register for semester end exams using NVDA screen readers due to missing ARIA labels.",
          barrierType: "Digital / Web Accessibility",
          location: "Online Exam Portal (fot.ruh.ac.lk/exams)",
          department: "Department of Information & Communication Technology",
          affectedGroup: "Visually Impaired Undergraduates",
          status: "Investigating",
          reportedBy: student._id,
          reporterName: student.name,
          adminNotes: "Assigned to Faculty IT team for ARIA audit.",
        },
      ];

      await BarrierReport.insertMany(barriers);
    }

    // Seed Initial Q&A Questions if empty
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      const defaultUser = await User.findOne({ email: "tech.student@fot.ruh.ac.lk" }) || await User.findOne();
      const defaultLecturer = await User.findOne({ role: "provider" }) || defaultUser;

      const defaultQuestions = [
        {
          title: "How can I find part-time jobs near Matara?",
          content: "I am a 2nd year ICT student looking for flexible weekend or evening part-time work near Kamburupitiya or Matara city center to support my studies.",
          category: "Jobs & Gigs",
          tags: ["Matara", "Part-Time", "Jobs"],
          author: defaultUser._id,
          authorName: "Kasun Silva",
          authorRole: "student",
          authorDepartment: "Department of Information & Communication Technology",
          upvotes: 8,
          answers: [
            {
              author: defaultLecturer._id,
              authorName: "Dr. K. L. Perera",
              authorRole: "provider",
              authorDepartment: "Department of Information & Communication Technology",
              content: "Check the OpportunityBridge jobs board filter for 'Jobs & Gigs'. Local IT firms near Matara software park frequently post weekend freelance roles.",
              upvotes: 5,
            },
          ],
        },
        {
          title: "Which scholarships do not need an income certificate?",
          content: "Some government scholarships ask for Grama Niladhari income proof. Are there merit-based or faculty research grants open purely on GPA?",
          category: "Scholarships",
          tags: ["Scholarship", "Financial Aid", "GPA"],
          author: defaultUser._id,
          authorName: "Nipuna Deshan",
          authorRole: "student",
          authorDepartment: "Department of Engineering Technology",
          upvotes: 12,
          answers: [
            {
              author: defaultLecturer._id,
              authorName: "Faculty Admin",
              authorRole: "admin",
              authorDepartment: "General",
              content: "The Faculty Innovation Grant and University Dean's Honor Roll Stipend do not require income certificates. They are awarded based on 1st & 2nd semester GPA.",
              upvotes: 9,
            },
          ],
        },
        {
          title: "Are there weekend-only gigs for students?",
          content: "Looking for remote or local weekend assignments like web maintenance, graphic design, or lab equipment documentation.",
          category: "Jobs & Gigs",
          tags: ["Weekend", "Freelance", "Remote"],
          author: defaultUser._id,
          authorName: "Sunil Shantha",
          authorRole: "student",
          authorDepartment: "Department of Biosystems Technology",
          upvotes: 6,
          answers: [],
        },
      ];

      await Question.insertMany(defaultQuestions);
      console.log("Community Q&A Board seeded with initial questions.");
    }
  } catch (error) {
    console.error("Error seeding initial data:", error.message);
  }
};

module.exports = seedDatabase;
