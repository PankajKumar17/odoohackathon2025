const mongoose = require("mongoose");

const url =
  "mongodb+srv://pankajfriend17910:y4Uqc4nBcJsqSNOy@cluster0.krjhy97.mongodb.net/";

module.exports.connect = () => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch((error) => console.log("Error: ", error));
};
