const SiteReview = require("../models/SiteReview");

// @desc    Get all website reviews
// @route   GET /api/site-reviews
// @access  Public
const getSiteReviews = async (req, res) => {
  try {
    const reviews = await SiteReview.find().sort({ createdAt: -1 });

    const total = reviews.length;
    const avgRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 5.0;

    res.json({
      reviews,
      total,
      averageRating: parseFloat(avgRating),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a website platform review
// @route   POST /api/site-reviews
// @access  Private
const createSiteReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ message: "Rating, title, and comment are required" });
    }

    const review = await SiteReview.create({
      user: req.user._id,
      userName: req.user.name,
      userRole: req.user.role,
      userDepartment: req.user.department || "Department of Information & Communication Technology",
      rating: Number(rating),
      title: title.trim(),
      comment: comment.trim(),
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSiteReviews,
  createSiteReview,
};
