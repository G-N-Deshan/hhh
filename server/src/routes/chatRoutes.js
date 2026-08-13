const express = require("express");
const router = express.Router();
const { processChat } = require("../controllers/chatController");

// Public AI Chatbot Endpoint
router.post("/", processChat);

module.exports = router;
