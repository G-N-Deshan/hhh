const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_DEFAULT_SECRET = "ruhuna_tech_faculty_opportunity_bridge_secret_key_2026";

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || JWT_DEFAULT_SECRET
    );
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "User belonging to token no longer exists" });
    }
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Administrator privileges required." });
  }
};

const providerOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "provider" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Provider or Administrator privileges required." });
  }
};

module.exports = { protect, adminOnly, providerOrAdmin };
