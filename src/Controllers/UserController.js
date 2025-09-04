const { signupService, loginService } = require("../services/authService");

async function signup(req, res) {
  try {
    const { username, email, password } = req.body;

    const { token, user } = await signupService({ username, email, password });

    return res.status(201).json({
      message: "Signup Successfully",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const token = await loginService(email, password);

    return res.status(200).json({
      message: "Login Successfully",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: err.message });
  }
}
async function profile(req, res) {
    return res.status(200).json({ message: "Welcome to profile"} );
}

module.exports = { signup ,login,profile};
