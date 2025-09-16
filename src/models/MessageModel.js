import mongoose from "mongoose";
 
const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    flatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flat",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } } // only created
);
 
const Message = mongoose.model("Message", messageSchema);
 
export default Message;