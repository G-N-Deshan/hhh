const ContactMessage = require("../models/ContactMessage");

// @desc    Submit contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const contactMsg = await ContactMessage.create({
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      status: "Unread",
    });

    res.status(201).json({
      message: "Contact message sent successfully to Admin",
      contactMsg,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages for Admin
// @route   GET /api/contact
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update contact message status & admin response
// @route   PUT /api/contact/:id
// @access  Private/Admin
const updateContactStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const msg = await ContactMessage.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (status) msg.status = status;
    if (adminResponse !== undefined) msg.adminResponse = adminResponse;

    await msg.save();
    res.json({ message: "Contact message status updated", contactMsg: msg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);

    if (!msg) {
      return res.status(404).json({ message: "Message not found" });
    }

    await msg.deleteOne();
    res.json({ message: "Contact message removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendContactMessage,
  getContactMessages,
  updateContactStatus,
  deleteContactMessage,
};
