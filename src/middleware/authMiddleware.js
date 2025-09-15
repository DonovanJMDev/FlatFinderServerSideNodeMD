import jwt from "jsonwebtoken";
import User from "../Models/UserModel.js";

// ====================
// PROTECT ROUTES (check JWT)
// ====================
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (without password)
      req.user = await User.findById(decoded.id).select("-password -__v");

      if (!req.user) {
        return res.status(404).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      console.error("JWT Error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// ====================
// ADMIN ONLY
// ====================
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

// ====================
// ACCOUNT OWNER OR ADMIN
// ====================
export const accountOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const userId = req.user._id ? req.user._id.toString() : null;
  const paramId = req.params.id ? req.params.id.toString() : null;

  if (req.user.isAdmin) {
    // ✅ Admin can access any account
    return next();
  }

  if (userId === paramId) {
    // ✅ User can access only their own account
    return next();
  }

  // ❌ Otherwise, deny
  return res.status(403).json({ message: "Access denied: not owner or admin" });
};
