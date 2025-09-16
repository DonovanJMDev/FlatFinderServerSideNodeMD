import express from "express";
import Message from "../Models/MessageModel.js";
import Flat from "../Models/FlatModel.js";
import { protect } from "../middleware/authMiddleware.js";
 
const router = express.Router();
 
// ====================
// GET ALL MESSAGES for a flat (only flat owner)
// ====================
router.get("/:flatId/messages", protect, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.flatId);
 
    if (!flat) return res.status(404).json({ message: "Flat not found" });
 
    // only flat owner can view all messages
    if (flat.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied: not flat owner" });
    }
 
    const messages = await Message.find({ flatId: flat._id }).populate("senderId", "firstName lastName email");
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// ====================
// GET USER MESSAGES for a flat (only the sender)
// ====================
router.get("/:flatId/messages/:senderId", protect, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.senderId) {
      return res.status(403).json({ message: "Access denied: not the sender" });
    }
 
    const messages = await Message.find({
      flatId: req.params.flatId,
      senderId: req.params.senderId,
    });
 
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// ====================
// ADD MESSAGE to a flat (any logged-in user)
// ====================
router.post("/:flatId/messages", protect, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.flatId);
 
    if (!flat) return res.status(404).json({ message: "Flat not found" });
 
    const message = await Message.create({
      content: req.body.content,
      flatId: flat._id,
      senderId: req.user._id,
    });
 
    res.status(201).json({ message: "Message sent ✅", data: message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
export default router;