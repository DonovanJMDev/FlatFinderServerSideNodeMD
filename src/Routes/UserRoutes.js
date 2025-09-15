import express from "express";
import User from "../Models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { protect, adminOnly, accountOwnerOrAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ====================
// GET ALL USERS (admin only)
// ====================
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password -__v");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// REGISTER (allows admin if sent in body)
// ====================
router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, birthDate, isAdmin } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      birthDate,
      isAdmin: isAdmin === true ? true : false,
      favouriteFlatsList: [],
    });

    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      birthDate: newUser.birthDate,
      isAdmin: newUser.isAdmin,
      favouriteFlatsList: newUser.favouriteFlatsList,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res.status(201).json({
      message: "User registered ✅",
      user: userResponse,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// LOGIN
// ====================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      const userResponse = {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
      };

      res.json({
        message: "Login successful ✅",
        user: userResponse,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ====================
// GET USER BY ID (protected, owner or admin)
// ====================
router.get("/:id", protect, accountOwnerOrAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -__v");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// UPDATE USER (owner or admin)
// ====================
router.patch("/:id", protect, accountOwnerOrAdmin, async (req, res) => {
  try {
    const updates = {};

    // Only update if the field is present in the request body
    if (req.body.firstName) updates.firstName = req.body.firstName;
    if (req.body.lastName) updates.lastName = req.body.lastName;
    if (req.body.birthDate) updates.birthDate = req.body.birthDate;

    // Hash password if updated
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(req.body.password, salt);
    }

    updates.updatedAt = new Date();

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password -__v");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated ✅",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ====================
// DELETE USER (owner or admin)
// ====================
router.delete("/:id", protect, accountOwnerOrAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
