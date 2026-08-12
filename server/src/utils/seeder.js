const User = require("../models/User");
const Opportunity = require("../models/Opportunity");
const BarrierReport = require("../models/BarrierReport");
const Question = require("../models/Question");
const generateCategoryData = require("./sampleData");

const seedDatabase = async () => {
  try {
    let admin = await User.findOne({ role: "admin" });
    let lecturer = await User.findOne({ role: "provider" });
    let student = await User.findOne({ role: "student" });

    // Seed default users if empty
    if (!admin) {
      admin = await User.create({
        name: "Faculty Admin",
        email: "admin@ruh.ac.lk",
        password: "Admin@123",
        role: "admin",
        department: "General",
        bio: "Dean & IT System Administrator - Faculty of Technology, University of Ruhuna",
      });
    }

    if (!lecturer) {
      lecturer = await User.create({
        name: "Dr. K. L. Perera",
        email: "dr.perera@fot.ruh.ac.lk",
        password: "Lecturer@123",
        role: "provider",
        department: "Department of Information & Communication Technology",
        bio: "Senior Lecturer in Cyber Security and Software Engineering",
      });
    }

    if (!student) {
      student = await User.create({
        name: "Kasun Silva",
        email: "tech.student@fot.ruh.ac.lk",
        password: "Student@123",
        role: "student",
        department: "Department of Engineering Technology",
        bio: "3rd Year Undergraduate in Engineering Technology (Robotics)",
      });
    }

    // Seed 100+ Opportunities across all 10 Categories if count < 10
    const oppCount = await Opportunity.countDocuments();
    if (oppCount < 10) {
      console.log("Seeding 100+ Opportunities across all 10 categories (10 items each)...");
      const sampleItems = generateCategoryData();
      
      const formattedItems = sampleItems.map((item) => ({
        ...item,
        postedBy: lecturer._id,
        postedByName: lecturer.name,
      }));

      await Opportunity.insertMany(formattedItems);
      console.log("Successfully seeded 100+ opportunities into MongoDB Atlas.");
    }

    // Seed default barrier reports if empty
    const barrierCount = await BarrierReport.countDocuments();
    if (barrierCount === 0) {
      const barriers = [
        {
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
          reportedBy: student._id,
          reporterName: student.name,
        },
      ];
      await BarrierReport.insertMany(barriers);
    }

    // Seed Q&A questions if empty
    const questionCount = await Question.countDocuments();
    if (questionCount === 0) {
      const defaultQuestions = [
        {
          title: "How can I find part-time jobs near Matara?",
          content: "I am a 2nd year ICT student looking for flexible weekend or evening part-time work near Kamburupitiya or Matara city center to support my studies.",
          category: "Jobs & Gigs",
          tags: ["Matara", "Part-Time", "Jobs"],
          author: student._id,
          authorName: "Kasun Silva",
          authorRole: "student",
          authorDepartment: "Department of Information & Communication Technology",
          upvotes: 8,
          answers: [
            {
              author: lecturer._id,
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
          author: student._id,
          authorName: "Nipuna Deshan",
          authorRole: "student",
          authorDepartment: "Department of Engineering Technology",
          upvotes: 12,
          answers: [
            {
              author: admin._id,
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
          author: student._id,
          authorName: "Sunil Shantha",
          authorRole: "student",
          authorDepartment: "Department of Biosystems Technology",
          upvotes: 6,
          answers: [],
        },
      ];
      await Question.insertMany(defaultQuestions);
    }
  } catch (error) {
    console.error("Error seeding initial data:", error.message);
  }
};

module.exports = seedDatabase;
