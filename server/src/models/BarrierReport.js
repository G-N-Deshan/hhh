const mongoose = require("mongoose");

const barrierReportSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Barrier report title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Barrier description is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Awareness",
        "Transport",
        "Financial",
        "Language",
        "Internet Access",
        "Documents",
        "Disability Access",
        "Timing",
        "Social Stigma",
        "Complex Process",
        "Infrastructure",
        "Equipment & Hardware",
        "Software & Network Access",
        "Mentorship & Academic Guidance",
        "Financial & Grants",
        "Other",
      ],
    },
    department: {
      type: String,
      enum: [
        "Department of Information & Communication Technology",
        "Department of Engineering Technology",
        "Department of Biosystems Technology",
        "Faculty Wide",
      ],
      default: "Faculty Wide",
    },
    location: {
      type: String,
      default: "Kamburupitiya Tech Campus",
    },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    urgency: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Investigating", "Resolved", "Closed"],
      default: "Pending",
    },
    adminResponse: {
      type: String,
      default: "",
    },
    resolutionNotes: {
      type: String,
      default: "",
    },
    opportunityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BarrierReport", barrierReportSchema);
