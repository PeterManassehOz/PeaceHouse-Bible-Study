const { generateTokenPassword, verifyPasswordAndGenerateToken } = require('../utils/generateTokenPassword');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { hashPassword, verifyPassword, generateToken } = require("../utils/generateTokenPassword");


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use `true` for port 465, `false` for 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});


const registerUser = async (req, res) => {
  try {
    const { firstname, lastname, email, phcode, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashed = await hashPassword(password);

    const user = await User.create({
      firstname,
      lastname,
      email,
      phcode,
      password: hashed,
    });

    const token = generateToken(user);

    res.status(201).json({ token, user });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body;

  
    const user = await User.findOne({
      $or: [{ email: identifier }, { phcode: identifier }],
    });

      console.log("DB USER PASSWORD HASH:", user.password);
      console.log("COMPARE RESULT:", await verifyPassword(password, user.password));

      console.log("LOGIN RAW PASSWORD:", JSON.stringify(password));
      console.log("LOGIN PASSWORD LENGTH:", password.length);


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await verifyPassword(password, user.password);

    console.log("LOGIN DEBUG:", {
      entered: password,
      hash: user.password,
      match: isMatch,
    });

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({ token, user });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const resetUserPassword = async (req, res) => {
  try {
    const { phcode, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ phcode });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = await hashPassword(password);

    await user.save();

    res.status(200).json({ message: "Password reset successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};



// 🔹 Request Password Reset (Generate Token)
const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Generate Reset Token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex"); // Hash the token
      const resetTokenExpires = Date.now() + 3600000; // Token expires in 1 hour
  
      // Store token in user model
      await User.findByIdAndUpdate(user._id, {
        resetToken: hashedToken,
        resetTokenExpires: resetTokenExpires,
      });
        
      // Send email with reset link
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Password Reset Request",
        html: `
          <p>You requested a password reset.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link is valid for 1 hour.</p>
        `,
      };
  
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Password reset email sent" });
    } catch (error) {
      console.error("Forgot Password Error:", error);
      return res.status(500).json({ message: "Server Error" });
    }
  };

// 🔹 Reset Password Using Token
const resetPasswordWithToken = async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    console.log("RESET RAW PASSWORD:", JSON.stringify(password));
    console.log("RESET PASSWORD LENGTH:", password.length);

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOneAndUpdate(
      {
        resetToken: hashedToken,
        resetTokenExpires: { $gt: Date.now() },
      },
      {
        $set: {
          password: await hashPassword(password),
          resetToken: null,
          resetTokenExpires: null,
        },
      },
      { new: true }
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    console.log("RESET SUCCESS:", user.phcode);

    return res.status(200).json({ message: "Password reset successful" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};


module.exports = { registerUser, loginUser, resetUserPassword, forgotPassword, resetPasswordWithToken };
