const mongoose = require("mongoose");

const contactMessageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      default: "General Inquiry",
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Unread", "Read", "Replied"],
      default: "Unread",
    },
    adminResponse: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
