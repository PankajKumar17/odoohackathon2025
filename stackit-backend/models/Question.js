const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  title: String,
  descreption: String,
  questionUrl: String,
  tags:[{
    type:String,
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  answers: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Answers",
  },
  user: Object,
});

module.exports = mongoose.model("Questions", QuestionSchema);
