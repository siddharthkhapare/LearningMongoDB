const User = require("../models/user.model");
const RefreshToken = require("../models/refreshToken.model");
const generateTokens = require("../utils/generateTokens");
const jwt = require("jsonwebtoken");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const { accessToken, refreshToken } = generateTokens(user);

    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) return res.status(403).json({ message: "Invalid token" });

  jwt.verify(refreshToken, process.env.REFRESH_SECRET, async (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    const user = await User.findById(decoded.id);

    const tokens = generateTokens(user);

    // Token Rotation
    await storedToken.deleteOne();
    await RefreshToken.create({
      user: user._id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    res.json(tokens);
  });
};

// LOGOUT
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await RefreshToken.deleteOne({ token: refreshToken });

  res.json({ message: "Logged out successfully" });
};
