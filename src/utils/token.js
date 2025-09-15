import jwt from "jsonwebtoken";

const token = jwt.sign(
  { id: user._id, isAdmin: user.isAdmin },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);
res.json({ token });
