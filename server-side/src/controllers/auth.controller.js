const { generateTokenPassword, verifyPasswordAndGenerateToken } = require('../utils/generateTokenPassword');
const User = require('../models/users.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { hashPassword, verifyPassword, generateToken } = require("../utils/generateTokenPassword");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function createTransporter() {
  const accessToken = await oauth2Client.getAccessToken();

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: accessToken.token,
    },
  });
}



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

  

      console.log("LOGIN RAW PASSWORD:", JSON.stringify(password));
      console.log("LOGIN PASSWORD LENGTH:", password.length);


    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    
    console.log("COMPARE RESULT:", await verifyPassword(password, user.password));
    
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

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before saving
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expiry (1 hour)
    const resetTokenExpires = Date.now() + 3600000;

    // Save token + expiry
    await User.findByIdAndUpdate(user._id, {
      resetToken: hashedToken,
      resetTokenExpires,
    });

    // Frontend URL
    const baseUrl =
      process.env.CLIENT_URL || "http://localhost:5173";

    const resetUrl = `${baseUrl}/reset-password/${resetToken}`;

    // Create transporter
    const transporter = await createTransporter();

    // Send email
    await transporter.sendMail({
      from: `Peace House Bible Study <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset Your Password - Peace House Bible Study",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08);">

            <!-- Header -->
            <div style="background: linear-gradient(135deg, #16a34a, #22c55e); padding: 24px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 22px;">
                Peace House Bible Study
              </h1>
            </div>

            <!-- Body -->
            <div style="padding: 30px; color: #333;">
              <h2 style="margin-top: 0; color: #111;">
                Password Reset Request
              </h2>

              <p style="font-size: 15px; line-height: 1.6;">
                Hello <strong>${user.firstname || "there"}</strong>,
              </p>

              <p style="font-size: 15px; line-height: 1.6;">
                We received a request to reset your password.
                Click the button below to continue.
              </p>

              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a
                  href="${resetUrl}"
                  style="
                    background: #16a34a;
                    color: #ffffff;
                    padding: 14px 28px;
                    border-radius: 8px;
                    text-decoration: none;
                    font-weight: bold;
                    display: inline-block;
                    font-size: 15px;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p style="font-size: 14px; color: #666; line-height: 1.6;">
                This link will expire in <strong>1 hour</strong>.
              </p>

              <p style="font-size: 14px; color: #666; line-height: 1.6;">
                If you did not request this, you can safely ignore this email.
              </p>

              <!-- Fallback URL -->
              <p style="font-size: 12px; color: #999; margin-top: 30px;">
                If the button doesn't work, copy and paste this link:
                <br />
                <a
                  href="${resetUrl}"
                  style="color: #16a34a; word-break: break-all;"
                >
                  ${resetUrl}
                </a>
              </p>
            </div>

            <!-- Footer -->
            <div style="background: #f1f5f9; text-align: center; padding: 15px; font-size: 12px; color: #777;">
              © ${new Date().getFullYear()} Peace House Bible Study.
              All rights reserved.
            </div>

          </div>
        </div>
      `,
    });

    console.log("Password reset email sent successfully");

    return res.status(200).json({
      message: "Password reset email sent",
    });

  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
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
