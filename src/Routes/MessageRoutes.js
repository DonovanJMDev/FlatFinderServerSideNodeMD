import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addMessage,
  getAllMessages,
  getUserMessages,
} from "../controllers/MessageController.js";

const router = express.Router();

// ====================
// GET ALL MESSAGES for a flat (only flat owner or admin)
// ====================
router.get("/:id/messages", protect, getAllMessages);

// ====================
// GET USER MESSAGES (only the sender or admin)
// ====================
router.get("/:id/messages/:senderId", protect, getUserMessages);

// ====================
// ADD MESSAGE to a flat (any logged-in user)
// ====================
router.post("/:id/messages", protect, addMessage);

export default router;
