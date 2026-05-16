const User = require("../models/users.model");
const jwt = require("jsonwebtoken");
const uploadToGCS = require("../utils/uploadToGCS");

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.username = req.body.username || user.username;
    user.bio = req.body.bio || user.bio;

    // Upload image to Google Cloud Storage
    if (req.file) {
      const imageUrl = await uploadToGCS(
        req.file,
        "profile-images"
      );

      user.image = imageUrl;
    }

    user.profileCompleted = true;

    await user.save();

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      token,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};