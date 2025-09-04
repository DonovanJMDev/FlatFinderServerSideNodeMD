const Comment = require("../models/CommentModel");

async function createComment(req, res) {
  try {
    const { text, postId } = req.body;
    const userId = req.user._id;
    const newComment = new Comment({ text, postId, user: userId });
    const savedComment = await newComment.save();
    res.status(201).json({ success: true, data: savedComment });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}

async function getAllComments(req, res) {
  try {
    const comments = await Comment.find().populate("user", "username email");
    res.json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = { createComment, getAllComments };
