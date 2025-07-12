const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Notification = require('../models/Notification');
const sanitizeInput = require('../utils/sanitizeInput');

// Get all answers for a question
exports.getAnswers = async (req, res, next) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate('author', 'username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: answers.length,
      data: answers,
    });
  } catch (error) {
    next(error);
  }
};

// Add answer to question
exports.addAnswer = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const sanitizedBody = sanitizeInput(req.body.body);

    const answer = await Answer.create({
      body: sanitizedBody,
      author: req.user.id,
      question: req.params.questionId,
    });

    // Add answer to question's answers array
    question.answers.push(answer._id);
    await question.save();

    // Create notification for question author
    if (question.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: question.author,
        type: 'answer',
        question: question._id,
        answer: answer._id,
        actor: req.user.id,
      });
    }

    res.status(201).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// Update answer
exports.updateAnswer = async (req, res, next) => {
  try {
    let answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this answer',
      });
    }

    const sanitizedBody = sanitizeInput(req.body.body);
    req.body.body = sanitizedBody;

    answer = await Answer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// Delete answer
exports.deleteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    // Make sure user is answer owner
    if (answer.author.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this answer',
      });
    }

    await answer.remove();

    // Remove answer from question's answers array
    const question = await Question.findById(answer.question);
    question.answers = question.answers.filter(
      (answerId) => answerId.toString() !== req.params.id
    );
    await question.save();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
