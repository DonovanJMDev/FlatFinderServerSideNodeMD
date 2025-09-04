const express = require('express');
const commentRouter = express.Router();
const CommentController = require('../Controllers/CommentController');
const authMiddleware = require('../middleware/ValidToken');

// Create a new comment

commentRouter.post('/', authMiddleware.verifyToken, CommentController.createComment);

// Get all comments
commentRouter.get('/', CommentController.getAllComments);

module.exports = commentRouter;