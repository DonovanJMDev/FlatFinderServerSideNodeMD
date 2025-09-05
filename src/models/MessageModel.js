const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.pre(/^find/, async function (next) {
  this.populate({
    path: "product",
    select: "title - suppliers",
  }).populate({
    path: "user",
    select: "fisrtName lastName - id",
  });
  next();
});

module.exports = mongoose.model("Comment", CommentSchema);
