const express = require('express');
const {
  getAnswers,
  addAnswer,
  updateAnswer,
  deleteAnswer,
} = require('../controllers/answerController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getAnswers)
  .post(protect, addAnswer);

router.route('/:id')
  .put(protect, updateAnswer)
  .delete(protect, deleteAnswer);

module.exports = router;
