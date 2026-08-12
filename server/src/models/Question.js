const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: "student" },
    authorDepartment: { type: String, default: "General" },
    content: { type: String, required: true, trim: true },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isAcceptedAnswer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Question title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Question content is required"],
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Scholarships", "Jobs & Gigs", "Internships", "Access & Barrier", "General"],
      default: "General",
    },
    tags: [{ type: String, trim: true }],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    authorRole: { type: String, default: "student" },
    authorDepartment: { type: String, default: "General" },
    upvotes: { type: Number, default: 0 },
    upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    answers: [answerSchema],
    isResolved: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
