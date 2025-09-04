const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function signupService({ username, email, password }) {
  // check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create user
  const user = new User({ username, email, password: hashedPassword });
  const newUser = await user.save();

  // create JWT
  const token = jwt.sign({ id: newUser._id }, "IMTHEBEST234344U54", {
    expiresIn: "1h",
  });

  return { token, user: newUser };
}
async function loginService(email,password){
  // check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid Email/Password");
  }
  var match = bcrypt.compare(password,user.password);

  if(!match){
    throw new Error("Password is Invalid");
  }
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1h",
});
return token;
}

module.exports = { signupService ,loginService};
