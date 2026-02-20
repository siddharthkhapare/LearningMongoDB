const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model");

exports.protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Not authorized" });

  const blacklisted = await BlacklistToken.findOne({ token });
  if (blacklisted)
    return res.status(401).json({ message: "Token invalidated" });

  jwt.verify(token, process.env.ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid token" });

    req.user = decoded;
    next();
  });
};
