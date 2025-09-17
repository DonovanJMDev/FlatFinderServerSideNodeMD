import Message from "../Models/MessageModel.js";
import Flat from "../Models/FlatModel.js";

// ====================
// ADD Message
// ====================
export const addMessage = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
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
};

// ====================
// GET ALL Messages (flat owner or admin)
// ====================
export const getAllMessages = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // only owner or admin can view all messages
    if (flat.ownerId.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: not flat owner" });
    }

    const messages = await Message.find({ flatId: flat._id })
      .populate("senderId", "firstName lastName email");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// GET Messages by Sender (sender or admin)
// ====================
export const getUserMessages = async (req, res) => {
  try {
    // only sender or admin can view
    if (req.user._id.toString() !== req.params.senderId && !req.user.isAdmin) {
      return res.status(403).json({ message: "Access denied: not the sender" });
    }

    const messages = await Message.find({
      flatId: req.params.id,
      senderId: req.params.senderId,
    });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
