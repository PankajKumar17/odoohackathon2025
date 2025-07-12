const express = require("express");
const router = express.Router();

const answerDB = require("../models/Answer");

router.post("/", async (req, res) => {
  try {
    await answerDB
      .create({
        answer: req.body.answer,
        questionId: req.body.questionId,
        user: req.body.user,
      })
      .then(() => {
        res.status(201).send({
          status: true,
          message: "Answer added successfully",
        });
      })
      .catch((e) => {
        res.status(400).send({
          status: false,
          message: "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while adding answer",
    });
  }
});

//upvote and downvote

router.post("/vote", async (req, res) => {
  const { answerId, userId, voteType } = req.body;
  try {
    const update = voteType === "upvote" ? { $addToSet: { "votes.upvotes": userId } } : { $addToSet: { "votes.downvotes": userId } };
    
    await answerDB.findByIdAndUpdate(answerId, update, { new: true })
      .then((updatedAnswer) => {
        res.status(200).send({
          status: true,
          message: "Vote updated successfully",
          data: updatedAnswer,
        });
      })
      .catch((e) => {
        res.status(400).send({
          status: false,
          message: "Bad request",
        });
      });
  } catch (e) {
    res.status(500).send({
      status: false,
      message: "Error while updating vote",
    });
  }
});


module.exports = router;
