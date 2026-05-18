const { generateTokenPassword, verifyPasswordAndGenerateToken } = require('../utils/generateTokenPassword');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { hashPassword, verifyPassword, generateToken } = require("../utils/generateTokenPassword");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);


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

  
      console.log("COMPARE RESULT:", await verifyPassword(password, user.password));

      console.log("LOGIN RAW PASSWORD:", JSON.stringify(password));
      console.log("LOGIN PASSWORD LENGTH:", password.length);


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log("DB USER PASSWORD HASH:", user.password);
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const resetTokenExpires = Date.now() + 3600000;

    await User.findByIdAndUpdate(user._id, {
      resetToken: hashedToken,
      resetTokenExpires,
    });

    const baseUrl = process.env.CLIENT_URL;
    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "Peace House Bible Study <onboarding@resend.dev>",
      to: user.email,
      subject: "Reset Your Password - Peace House Bible Study",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden;">

            <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0;">Peace House Bible Study</h1>
            </div>

            <div style="padding: 30px;">
              <h2>Password Reset Request</h2>

              <p>Hello <strong>${user.firstname || "there"}</strong>,</p>

              <p>Click below to reset your password:</p>

              <div style="text-align:center; margin: 30px 0;">
                <a href="${resetUrl}"
                  style="background:#16a34a;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;">
                  Reset Password
                </a>
              </div>

              <p>This link expires in 1 hour.</p>

              <p>If you didn’t request this, ignore this email.</p>

              <p style="font-size:12px;color:#999;">
                ${resetUrl}
              </p>
            </div>

          </div>
        </div>
      `,
    });

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
