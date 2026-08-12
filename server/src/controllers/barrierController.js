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

    const reports = await BarrierReport.find(query)
      .populate("reportedBy", "name email department role")
      .sort({ createdAt: -1 });

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
    const report = await BarrierReport.findById(req.params.id).populate(
      "reportedBy",
      "name email department role"
    );

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
// @access  Private (Any authenticated user)
const createBarrierReport = async (req, res) => {
  try {
    const { title, description, category, department, urgency } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Title, description, and category are required" });
    }

    const report = await BarrierReport.create({
      title,
      description,
      category,
      department: department || req.user.department || "Faculty Wide",
      urgency: urgency || "Medium",
      reportedBy: req.user._id,
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
    const report = await BarrierReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Barrier report not found" });
    }

    // Only Admin or Provider can update status
    if (req.user.role !== "admin" && req.user.role !== "provider") {
      return res.status(403).json({ message: "Forbidden. Administrative access required." });
    }

    if (req.body.status) report.status = req.body.status;
    if (req.body.resolutionNotes !== undefined)
      report.resolutionNotes = req.body.resolutionNotes;
    if (req.body.urgency) report.urgency = req.body.urgency;

    const updatedReport = await report.save();
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete barrier report
// @route   DELETE /api/barriers/:id
// @access  Private (Reporter or Admin)
const deleteBarrierReport = async (req, res) => {
  try {
    const report = await BarrierReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Barrier report not found" });
    }

    if (
      report.reportedBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this barrier report" });
    }

    await report.deleteOne();
    res.json({ message: "Barrier report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics overview
// @route   GET /api/barriers/analytics/overview
// @access  Public / Admin
const getBarrierAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const openOpportunities = await Opportunity.countDocuments({ status: "Open" });

    const totalBarriers = await BarrierReport.countDocuments();
    const pendingBarriers = await BarrierReport.countDocuments({ status: "Pending" });
    const inReviewBarriers = await BarrierReport.countDocuments({ status: "In Review" });
    const resolvedBarriers = await BarrierReport.countDocuments({ status: "Resolved" });

    // Category distribution for charts
    const categoryStats = await BarrierReport.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Urgency distribution
    const urgencyStats = await BarrierReport.aggregate([
      { $group: { _id: "$urgency", count: { $sum: 1 } } },
    ]);

    // Department opportunity count
    const oppDepartmentStats = await Opportunity.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    res.json({
      summary: {
        totalUsers,
        totalOpportunities,
        openOpportunities,
        totalBarriers,
        pendingBarriers,
        inReviewBarriers,
        resolvedBarriers,
      },
      categoryStats,
      urgencyStats,
      oppDepartmentStats,
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
  getBarrierAnalytics,
};
