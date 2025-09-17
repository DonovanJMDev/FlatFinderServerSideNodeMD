import Flat from "../Models/FlatModel.js";

// ====================
// CREATE Flat
// ====================
export const createFlat = async (req, res) => {
  try {
    const newFlat = await Flat.create({
      ...req.body,
      ownerId: req.user._id, // logged-in user becomes owner
    });

    res.status(201).json({
      message: "Flat created ✅",
      flat: newFlat,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// GET ALL Flats
// ====================
export const getAllFlats = async (req, res) => {
  try {
    const flats = await Flat.find().populate("ownerId", "firstName lastName email");
    res.json(flats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// GET Flat by ID
// ====================
export const getFlatById = async (req, res) => {
  try {
    const flat = await Flat.findById(req.params.id).populate("ownerId", "firstName lastName email");
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// UPDATE Flat (owner or admin)
// ====================
export const updateFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json(flat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ====================
// DELETE Flat (owner or admin)
// ====================
export const deleteFlat = async (req, res) => {
  try {
    const flat = await Flat.findByIdAndDelete(req.params.id);
    if (!flat) return res.status(404).json({ message: "Flat not found" });
    res.json({ message: "Flat deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
