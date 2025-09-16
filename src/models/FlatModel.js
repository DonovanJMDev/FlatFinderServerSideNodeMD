import mongoose from "mongoose";
 
const flatSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
      trim: true,
    },
    streetName: {
      type: String,
      required: true,
      trim: true,
    },
    streetNumber: {
      type: String,
      required: true,
      trim: true,
    },
    areaSize: {
      type: Number,
      required: true,
    },
    hasAC: {
      type: Boolean,
      default: false,
    },
    yearBuilt: {
      type: Number,
      required: true,
    },
    rentPrice: {
      type: Number,
      required: true,
    },
    dateAvailable: {
      type: Date,
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true } // ✅ automatically adds createdAt & updatedAt
);
 
const Flat = mongoose.model("Flat", flatSchema);
 
export default Flat;