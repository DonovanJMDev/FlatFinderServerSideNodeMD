import express from "express";
import Flat from "../Models/FlatModel.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ====================
// GET ALL FLATS (public)
// ====================
router.get("/", async (req, res) => {
  try {
    const flats = await Flat.find().populate("ownerId", "firstName lastName email");
    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// GET FLAT BY ID (public)
// ====================
router.get("/:id", async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("ownerId", "firstName lastName email");
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// CREATE FLAT (only logged-in user)
// ====================
router.post("/", protect, async (req, res) => {
  try {
    const {
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
    } = req.body;

    const flat = await Flat.create({
      city,
      streetName,
      streetNumber,
      areaSize,
      hasAC,
      yearBuilt,
      rentPrice,
      dateAvailable,
      ownerId: req.user._id, // logged-in user is the owner
    });

    res.status(201).json({ message: "Flat created ✅", flat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// UPDATE FLAT (only owner or admin)
// ====================
router.patch("/:id", protect, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);

    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // ✅ Check ownership or admin
    if (
      flat.ownerId.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied: not flat owner or admin" });
    }

    Object.assign(flat, req.body);
    flat.updatedAt = new Date();
    await flat.save();

    res.json({ message: "Flat updated ✅", flat });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// DELETE FLAT (only owner or admin)
// ====================
router.delete("/:id", protect, async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id);

    if (!flat) return res.status(404).json({ message: "Flat not found" });

    // ✅ Check ownership or admin
    if (
      flat.ownerId.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Access denied: not flat owner or admin" });
    }

    await flat.deleteOne();
    res.json({ message: "Flat deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
