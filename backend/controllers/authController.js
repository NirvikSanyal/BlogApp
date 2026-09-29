const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createToken = (userId) => {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

exports.signup = async (req, res, next) => {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const { password } = req.body;

    if (!name || !email || typeof password !== "string") {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    if (await User.exists({ email })) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    res
      .status(201)
      .json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const email =
      typeof req.body.email === "string"
        ? req.body.email.trim().toLowerCase()
        : "";
    const { password } = req.body;
    if (!email || typeof password !== "string" || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({ token: createToken(user._id), user: publicUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.me = (req, res) => res.json({ user: publicUser(req.user) });
