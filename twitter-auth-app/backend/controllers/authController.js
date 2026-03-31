const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { validatePassword, hashPassword, comparePassword } = require('../utils/passwordUtils');
const { generateTokenPair } = require('../utils/jwtUtils');

/**
 * SIGNUP - Register a new user
 */
const signup = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName } = req.validatedData;

    // Check if email already exists
    const existingEmail = await User.findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if username already exists
    const existingUsername = await User.findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Username already taken'
      });
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await User.createUser({
      email,
      username,
      passwordHash,
      firstName,
      lastName
    });

    // Remove sensitive data
    const { passwordHash: _, ...userResponse } = user;

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Create session
    await User.createSession(user.id, tokens.refreshToken);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: userResponse,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Signup failed: ' + error.message
    });
  }
};

/**
 * LOGIN - Authenticate user with credentials
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.validatedData;

    // Find user by email
    const user = await User.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Compare passwords
    const passwordMatch = await comparePassword(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user.id);

    // Create session
    await User.createSession(user.id, tokens.refreshToken);

    // Remove sensitive data
    const { passwordHash: _, ...userResponse } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userResponse,
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed: ' + error.message
    });
  }
};

/**
 * REFRESH TOKEN - Get new access token using refresh token
 */
const refreshToken = async (req, res) => {
  try {
    const { userId } = req.user;

    // Generate new tokens
    const tokens = generateTokenPair(userId);

    // Create new session
    await User.createSession(userId, tokens.refreshToken);

    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        tokens: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      }
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token refresh failed: ' + error.message
    });
  }
};

/**
 * LOGOUT - Invalidate current session
 */
const logout = async (req, res) => {
  try {
    const { userId } = req.user;
    const { refreshToken } = req.body;

    if (refreshToken) {
      const session = await User.findSessionByRefreshToken(refreshToken);
      if (session) {
        await User.deleteSession(session.id);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed: ' + error.message
    });
  }
};

/**
 * LOGOUT ALL DEVICES - Invalidate all sessions for user
 */
const logoutAllDevices = async (req, res) => {
  try {
    const { userId } = req.user;

    const deletedCount = await User.deleteUserSessions(userId);

    return res.status(200).json({
      success: true,
      message: `Logged out from ${deletedCount} device(s)`,
      data: {
        sessionsTerminated: deletedCount
      }
    });
  } catch (error) {
    console.error('Logout all devices error:', error);
    return res.status(500).json({
      success: false,
      message: 'Logout failed: ' + error.message
    });
  }
};

/**
 * GET USER PROFILE - Get current user info
 */
const getProfile = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove sensitive data
    const { passwordHash: _, ...userResponse } = user;

    return res.status(200).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch profile: ' + error.message
    });
  }
};

/**
 * GET SESSIONS - Get all active sessions for user
 */
const getSessions = async (req, res) => {
  try {
    const { userId } = req.user;

    const sessions = await User.getUserSessions(userId);

    return res.status(200).json({
      success: true,
      data: {
        sessions,
        total: sessions.length
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions: ' + error.message
    });
  }
};

/**
 * CHANGE PASSWORD - Update user password
 */
const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Find user
    const user = await User.findUserById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const passwordMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      return res.status(400).json({
        success: false,
        message: 'New password does not meet requirements',
        errors: passwordValidation.errors
      });
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update user
    await User.updateUser(userId, { passwordHash: newPasswordHash });

    // Logout all devices (security measure)
    await User.deleteUserSessions(userId);

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully. Please login again.'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password: ' + error.message
    });
  }
};

module.exports = {
  signup,
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  getProfile,
  getSessions,
  changePassword
};
