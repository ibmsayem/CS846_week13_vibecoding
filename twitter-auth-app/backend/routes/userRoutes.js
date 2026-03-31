const express = require("express");
const { updateProfile, getUserProfile } = require("../controllers/userController");
const authenticate = require("../middleware/authenticate");

const router = express.Router();

// Route to update user profile
router.put("/profile", authenticate, updateProfile);

// Route to get user profile by ID
router.get("/:userId", getUserProfile);

module.exports = router;