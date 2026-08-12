const mongoose = require("mongoose");

const siteReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      default: "student",
    },
    userDepartment: {
      type: String,
      default: "Department of Information & Communication Technology",
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SiteReview", siteReviewSchema);
