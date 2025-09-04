const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // buyer
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // purchased product
      quantity: Number,
    },
  ],
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
