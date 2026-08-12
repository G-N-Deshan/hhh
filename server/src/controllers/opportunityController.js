const Opportunity = require("../models/Opportunity");

// @desc    Get all opportunities with search & filter
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = async (req, res) => {
  try {
    const { keyword, category, department, status } = req.query;

    let query = {};

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (department && department !== "All") {
      query.department = department;
    }

    if (status) {
      query.status = status;
    }

    const opportunities = await Opportunity.find(query)
      .populate("createdBy", "name email department role")
      .sort({ createdAt: -1 });

    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single opportunity by ID
// @route   GET /api/opportunities/:id
// @access  Public
const getOpportunityById = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate(
      "createdBy",
      "name email department role"
    );

    if (opportunity) {
      res.json(opportunity);
    } else {
      res.status(404).json({ message: "Opportunity not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private (Provider/Admin)
const createOpportunity = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      department,
      location,
      deadline,
      requirements,
      contactEmail,
      applicationUrl,
      tags,
    } = req.body;

    if (!title || !description || !category || !deadline || !contactEmail) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const opportunity = await Opportunity.create({
      title,
      description,
      category,
      department: department || "All Departments",
      location: location || "Faculty Campus / Hybrid",
      deadline,
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      contactEmail,
      applicationUrl: applicationUrl || "",
      tags: Array.isArray(tags)
        ? tags
        : typeof tags === "string"
        ? tags.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      createdBy: req.user._id,
    });

    res.status(201).json(opportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an opportunity
// @route   PUT /api/opportunities/:id
// @access  Private (Creator or Admin)
const updateOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    // Check ownership or admin status
    if (
      opportunity.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this opportunity" });
    }

    opportunity.title = req.body.title || opportunity.title;
    opportunity.description = req.body.description || opportunity.description;
    opportunity.category = req.body.category || opportunity.category;
    opportunity.department = req.body.department || opportunity.department;
    opportunity.location = req.body.location || opportunity.location;
    opportunity.deadline = req.body.deadline || opportunity.deadline;
    opportunity.contactEmail = req.body.contactEmail || opportunity.contactEmail;
    opportunity.applicationUrl =
      req.body.applicationUrl !== undefined
        ? req.body.applicationUrl
        : opportunity.applicationUrl;
    opportunity.status = req.body.status || opportunity.status;

    if (req.body.requirements !== undefined) {
      opportunity.requirements = Array.isArray(req.body.requirements)
        ? req.body.requirements
        : typeof req.body.requirements === "string"
        ? req.body.requirements.split(",").map((s) => s.trim()).filter(Boolean)
        : opportunity.requirements;
    }

    if (req.body.tags !== undefined) {
      opportunity.tags = Array.isArray(req.body.tags)
        ? req.body.tags
        : typeof req.body.tags === "string"
        ? req.body.tags.split(",").map((s) => s.trim()).filter(Boolean)
        : opportunity.tags;
    }

    const updatedOpportunity = await opportunity.save();
    res.json(updatedOpportunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private (Creator or Admin)
const deleteOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (
      opportunity.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this opportunity" });
    }

    await opportunity.deleteOne();
    res.json({ message: "Opportunity removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};
