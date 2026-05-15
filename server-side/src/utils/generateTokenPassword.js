const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizePassword = (password) => {
  return String(password).trim();
};

const hashPassword = async (password) => {
  return bcrypt.hash(normalizePassword(password), 10);
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(normalizePassword(password), hash);
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
};