const express = require("express");
const router = express.Router();
const {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  upvoteQuestion,
  deleteQuestion,
} = require("../controllers/qaController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", protect, createQuestion);
router.post("/:id/answer", protect, answerQuestion);
router.put("/:id/upvote", protect, upvoteQuestion);
router.delete("/:id", protect, deleteQuestion);

module.exports = router;
