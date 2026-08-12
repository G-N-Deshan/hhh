const Question = require("../models/Question");

// @desc    Get all questions with optional search and category filter
// @route   GET /api/qa
// @access  Public
const getQuestions = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const questions = await Question.find(query)
      .sort({ createdAt: -1 })
      .populate("author", "name email role department");

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single question by ID
// @route   GET /api/qa/:id
// @access  Public
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("author", "name email role department")
      .populate("answers.author", "name email role department");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    question.views += 1;
    await question.save();

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new question
// @route   POST /api/qa
// @access  Private
const createQuestion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Please provide both title and content for the question" });
    }

    const question = await Question.create({
      title,
      content,
      category: category || "General",
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim())) : [],
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      authorDepartment: req.user.department,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add an answer to a question
// @route   POST /api/qa/:id/answer
// @access  Private
const answerQuestion = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Answer content cannot be empty" });
    }

    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newAnswer = {
      author: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role,
      authorDepartment: req.user.department,
      content,
      upvotes: 0,
    };

    question.answers.push(newAnswer);
    await question.save();

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upvote a question
// @route   PUT /api/qa/:id/upvote
// @access  Private
const upvoteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const userIdStr = req.user._id.toString();
    const alreadyUpvoted = question.upvotedBy.some((id) => id.toString() === userIdStr);

    if (alreadyUpvoted) {
      question.upvotedBy = question.upvotedBy.filter((id) => id.toString() !== userIdStr);
      question.upvotes = Math.max(0, question.upvotes - 1);
    } else {
      question.upvotedBy.push(req.user._id);
      question.upvotes += 1;
    }

    await question.save();
    res.json({ upvotes: question.upvotes, upvotedBy: question.upvotedBy });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a question (Author or Admin)
// @route   DELETE /api/qa/:id
// @access  Private
const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this question" });
    }

    await question.deleteOne();
    res.json({ message: "Question removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  answerQuestion,
  upvoteQuestion,
  deleteQuestion,
};

