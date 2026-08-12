const express = require("express");
const router = express.Router();
const { getSiteReviews, createSiteReview } = require("../controllers/siteReviewController");
const { protect } = require("../middleware/authMiddleware");

router.route("/")
  .get(getSiteReviews)
  .post(protect, createSiteReview);

module.exports = router;
