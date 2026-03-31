const User = require("../models/User");

// Controller to update user profile
exports.updateProfile = (req, res) => {
  const userId = req.user.id; // Assuming user ID is available in req.user
  const { bio, profilePicture } = req.body;

  try {
    const user = User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.updateProfile({ bio, profilePicture });
    return res.status(200).json({ success: true, message: "Profile updated successfully", data: user });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

// Controller to get user profile by ID
exports.getUserProfile = (req, res) => {
  const { userId } = req.params;

  try {
    const user = User.findUserById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Remove sensitive data
    const { passwordHash, ...userResponse } = user;
    return res.status(200).json({ success: true, data: userResponse });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};