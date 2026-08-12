const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
  addOpportunityReview,
} = require("../controllers/opportunityController");
const { protect, providerOrAdmin } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(getOpportunities)
  .post(protect, providerOrAdmin, createOpportunity);

router
  .route("/:id")
  .get(getOpportunityById)
  .put(protect, providerOrAdmin, updateOpportunity)
  .delete(protect, providerOrAdmin, deleteOpportunity);

router
  .route("/:id/reviews")
  .post(protect, addOpportunityReview);

module.exports = router;
