const Application = require("../models/Application");
const Opportunity = require("../models/Opportunity");

// @desc    Apply for an opportunity
// @route   POST /api/opportunities/:id/apply
// @access  Private / Public (optional user)
const applyForOpportunity = async (req, res) => {
  try {
    const opportunityId = req.params.id;
    const { applicantName, applicantEmail, studentId, coverNote } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    const application = await Application.create({
      opportunity: opportunityId,
      opportunityTitle: opportunity.title,
      applicant: req.user ? req.user._id : null,
      applicantName: applicantName || req.user?.name || "Applicant",
      applicantEmail: applicantEmail || req.user?.email || "applicant@fot.ruh.ac.lk",
      studentId: studentId || "",
      coverNote: coverNote || "",
      status: "Submitted",
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for logged in user
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      $or: [{ applicant: req.user._id }, { applicantEmail: req.user.email }],
    })
      .populate("opportunity", "title category department location deadline contactEmail")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all applications (Admin & Providers)
// @route   GET /api/applications
// @access  Private/Admin
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("opportunity", "title category department location deadline contactEmail")
      .populate("applicant", "name email department role")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status & admin notes
// @route   PUT /api/applications/:id
// @access  Private/Admin
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (status) application.status = status;
    if (adminNotes !== undefined) application.adminNotes = adminNotes;

    await application.save();

    res.json({ message: "Application status updated successfully", application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private/Admin
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await application.deleteOne();
    res.json({ message: "Application removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForOpportunity,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
};
