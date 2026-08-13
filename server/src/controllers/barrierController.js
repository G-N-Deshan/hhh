const BarrierReport = require("../models/BarrierReport");
const Opportunity = require("../models/Opportunity");
const User = require("../models/User");

// @desc    Get all barrier reports
// @route   GET /api/barriers
// @access  Public
const getBarrierReports = async (req, res) => {
  try {
    const { category, department, urgency, status } = req.query;

    let query = {};

    if (category && category !== "All") query.category = category;
    if (department && department !== "All") query.department = department;
    if (urgency && urgency !== "All") query.urgency = urgency;
    if (status && status !== "All") query.status = status;

    const reports = await BarrierReport.find(query).sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single barrier report
// @route   GET /api/barriers/:id
// @access  Public
const getBarrierReportById = async (req, res) => {
  try {
    let report = null;
    try {
      report = await BarrierReport.findById(req.params.id);
    } catch (e) {
      report = await BarrierReport.findOne({ _id: req.params.id });
    }

    if (report) {
      res.json(report);
    } else {
      res.status(404).json({ message: "Barrier report not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new barrier report
// @route   POST /api/barriers
// @access  Public / Private
const createBarrierReport = async (req, res) => {
  try {
    const { title, description, category, department, urgency, location } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const report = await BarrierReport.create({
      title,
      description,
      category,
      location: location || "Faculty of Technology",
      department: department || req.user?.department || "Department of Information & Communication Technology",
      urgency: urgency || "Medium",
      reportedBy: req.user?._id || null,
      status: "Pending",
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update barrier report status or resolution notes
// @route   PUT /api/barriers/:id
// @access  Private (Admin or Provider)
const updateBarrierStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    let report = null;

    try {
      report = await BarrierReport.findById(req.params.id);
    } catch (e) {
      report = await BarrierReport.findOne({ _id: req.params.id });
    }

    if (!report) {
      return res.status(404).json({ message: "Barrier report not found" });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete barrier report
// @route   DELETE /api/barriers/:id
// @access  Private (Admin or Provider)
const deleteBarrierReport = async (req, res) => {
  try {
    let report = null;
    try {
      report = await BarrierReport.findById(req.params.id);
    } catch (e) {
      report = await BarrierReport.findOne({ _id: req.params.id });
    }

    if (!report) {
      return res.status(404).json({ message: "Barrier report not found" });
    }

    await report.deleteOne();

    res.json({ message: "Barrier report removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get executive analytics overview
// @route   GET /api/barriers/analytics/overview
// @access  Private (Admin)
const getAnalyticsOverview = async (req, res) => {
  try {
    const totalOpportunities = await Opportunity.countDocuments();
    const openOpportunities = await Opportunity.countDocuments({ status: "Open" });
    const totalUsers = await User.countDocuments();
    const totalBarriers = await BarrierReport.countDocuments();
    const pendingBarriers = await BarrierReport.countDocuments({ status: "Pending" });
    const resolvedBarriers = await BarrierReport.countDocuments({ status: "Resolved" });

    res.json({
      summary: {
        totalOpportunities,
        openOpportunities,
        totalUsers,
        totalBarriers,
        pendingBarriers,
        resolvedBarriers,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBarrierReports,
  getBarrierReportById,
  createBarrierReport,
  updateBarrierStatus,
  deleteBarrierReport,
  getAnalyticsOverview,
};
