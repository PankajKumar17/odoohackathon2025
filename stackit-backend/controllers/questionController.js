const Question = require('../models/Question');
const Tag = require('../models/Tag');
const sanitizeInput = require('../utils/sanitizeInput');

// Get all questions
exports.getQuestions = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .populate('author', 'username')
      .populate('tags', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// Get single question
exports.getQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('author', 'username')
      .populate('tags', 'name')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'username',
        },
      });

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Increment view count
    question.views += 1;
    await question.save();

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Create new question
exports.createQuestion = async (req, res, next) => {
  try {
    const { title, body, tags } = req.body;

    const sanitizedBody = sanitizeInput(body);

    const question = await Question.create({
      title,
      body: sanitizedBody,
      author: req.user.id,
      tags,
    });

    // Update tags question count
    await Tag.updateMany(
      { _id: { $in: tags } },
      { $inc: { questionsCount: 1 } }
    );

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Update question
exports.updateQuestion = async (req, res, next) => {
  try {
    let question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this question',
      });
    }

    const sanitizedBody = sanitizeInput(req.body.body);
    req.body.body = sanitizedBody;

    question = await Question.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Delete question
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Make sure user is question owner
    if (question.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this question',
      });
    }

    await question.remove();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
