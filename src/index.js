import express from "express";
import mongoose from "mongoose";
 
const app = express();
const PORT = 5001; 
app.use(express.json());
 
// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/flatfinder";
 
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ Error connecting to MongoDB:", err));
 
// --- User model ---
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  birthDate: Date
});
 
const User = mongoose.model("User", userSchema);
 
// --- Routes ---
 
// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});
 
// Register user
app.post("/users/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: "User registered ✅", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// Login user (dummy example)
app.post("/users/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials ❌" });
    res.json({ message: "Login successful ✅", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
 
// --- Start server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});