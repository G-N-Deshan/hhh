const jwt = require("jsonwebtoken");

const JWT_DEFAULT_SECRET = "ruhuna_tech_faculty_opportunity_bridge_secret_key_2026";

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || JWT_DEFAULT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "30d",
    }
  );
};

module.exports = generateToken;
