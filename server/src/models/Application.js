const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    opportunityTitle: {
      type: String,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    applicantName: {
      type: String,
      required: true,
    },
    applicantEmail: {
      type: String,
      required: true,
    },
    studentId: {
      type: String,
    },
    coverNote: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Submitted", "Under Review", "Shortlisted", "Accepted", "Rejected"],
      default: "Submitted",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
