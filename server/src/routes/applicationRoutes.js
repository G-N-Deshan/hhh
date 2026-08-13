const express = require("express");
const router = express.Router();
const {
  applyForOpportunity,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
} = require("../controllers/applicationController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Student apply route
router.post("/opportunity/:id/apply", protect, applyForOpportunity);

// Student get my applications
router.get("/my", protect, getMyApplications);

// Admin / Provider manage applications
router.get("/", protect, adminOnly, getAllApplications);
router.put("/:id", protect, adminOnly, updateApplicationStatus);
router.delete("/:id", protect, adminOnly, deleteApplication);

module.exports = router;
