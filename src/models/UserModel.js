import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    favouriteFlatsList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flat",
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// ✅ Clean response automatically
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password; // remove password
  delete obj.__v;      // remove internal version field
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;
