import express from "express";
import mongoose from "mongoose";
import userRouter from "./Routes/UserRoutes.js";
import User from "./Models/UserModel.js";

const app = express();

app.use(express.json());
app.use("/users", userRouter);

const PORT = 5001;

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://mongo:27017/flatfinder";

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Error connecting to MongoDB:", err));

// --- Routes ---

// Test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

// --- Start server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
