const express = require('express');
const {
  voteQuestion,
  voteAnswer,
} = require('../controllers/voteController');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/questions/:id/vote', protect, voteQuestion);
router.post('/answers/:id/vote', protect, voteAnswer);

module.exports = router;
