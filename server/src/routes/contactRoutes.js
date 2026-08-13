const express = require("express");
const router = express.Router();
const {
  sendContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
} = require("../controllers/contactController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

// Public submit contact message
router.post("/", sendContactMessage);

// Admin manage contact messages
router.get("/", protect, adminOnly, getContactMessages);
router.put("/:id", protect, adminOnly, updateContactStatus);
router.delete("/:id", protect, adminOnly, deleteContactMessage);

module.exports = router;
