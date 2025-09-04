const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: [true, "This filed is required"] },
  email: { type: String },
  password: { type: String, required: true },
});
const user = mongoose.model("User", UserSchema);

module.exports = user;
