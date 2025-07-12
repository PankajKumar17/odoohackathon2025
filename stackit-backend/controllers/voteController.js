const Question = require('../models/Question');
const Answer = require('../models/Answer');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Vote on question
exports.voteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    const { voteType } = req.body; // 'upvote' or 'downvote'

    // Check if user has already voted
    const hasUpvoted = question.votes.upvotes.includes(req.user.id);
    const hasDownvoted = question.votes.downvotes.includes(req.user.id);

    // Update votes
    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        question.votes.upvotes = question.votes.upvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add upvote and remove downvote if exists
        question.votes.upvotes.push(req.user.id);
        question.votes.downvotes = question.votes.downvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote
        question.votes.downvotes = question.votes.downvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add downvote and remove upvote if exists
        question.votes.downvotes.push(req.user.id);
        question.votes.upvotes = question.votes.upvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      }
    }

    await question.save();

    // Update author's reputation
    const author = await User.findById(question.author);
    const reputationChange = calculateReputationChange(
      hasUpvoted,
      hasDownvoted,
      voteType
    );
    author.reputation += reputationChange;
    await author.save();

    // Create notification if it's an upvote
    if (voteType === 'upvote' && !hasUpvoted && question.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: question.author,
        type: 'vote',
        question: question._id,
        actor: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    next(error);
  }
};

// Vote on answer
exports.voteAnswer = async (req, res, next) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({
        success: false,
        message: 'Answer not found',
      });
    }

    const { voteType } = req.body; // 'upvote' or 'downvote'

    // Check if user has already voted
    const hasUpvoted = answer.votes.upvotes.includes(req.user.id);
    const hasDownvoted = answer.votes.downvotes.includes(req.user.id);

    // Update votes
    if (voteType === 'upvote') {
      if (hasUpvoted) {
        // Remove upvote
        answer.votes.upvotes = answer.votes.upvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add upvote and remove downvote if exists
        answer.votes.upvotes.push(req.user.id);
        answer.votes.downvotes = answer.votes.downvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      }
    } else if (voteType === 'downvote') {
      if (hasDownvoted) {
        // Remove downvote
        answer.votes.downvotes = answer.votes.downvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      } else {
        // Add downvote and remove upvote if exists
        answer.votes.downvotes.push(req.user.id);
        answer.votes.upvotes = answer.votes.upvotes.filter(
          (id) => id.toString() !== req.user.id
        );
      }
    }

    await answer.save();

    // Update author's reputation
    const author = await User.findById(answer.author);
    const reputationChange = calculateReputationChange(
      hasUpvoted,
      hasDownvoted,
      voteType
    );
    author.reputation += reputationChange;
    await author.save();

    // Create notification if it's an upvote
    if (voteType === 'upvote' && !hasUpvoted && answer.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: answer.author,
        type: 'vote',
        question: answer.question,
        answer: answer._id,
        actor: req.user.id,
      });
    }

    res.status(200).json({
      success: true,
      data: answer,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate reputation change
const calculateReputationChange = (hasUpvoted, hasDownvoted, voteType) => {
  if (voteType === 'upvote') {
    if (hasUpvoted) return -10; // Removing upvote
    return hasDownvoted ? 12 : 10; // Adding upvote (and removing downvote if exists)
  } else {
    if (hasDownvoted) return 2; // Removing downvote
    return hasUpvoted ? -12 : -2; // Adding downvote (and removing upvote if exists)
  }
};
