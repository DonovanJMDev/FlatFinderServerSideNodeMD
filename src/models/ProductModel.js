const mongoose  = require("mongoose")

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, "This filed is required"] },
  description: { type: String },
  price: { type: Number, min: 0, required: true },
});
const product = mongoose.model("Product", ProductSchema);

module.exports = product;