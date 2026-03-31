const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authMiddleware, refreshTokenMiddleware } = require('../middleware/authMiddleware');
const { validateRequest, signupSchema, loginSchema } = require('../middleware/validationMiddleware');

// ==================== PUBLIC ROUTES ====================

/**
 * POST /api/v1/auth/signup
 * Register a new user
 */
router.post('/signup', validateRequest(signupSchema), authController.signup);

/**
 * POST /api/v1/auth/login
 * Login with email and password
 */
router.post('/login', validateRequest(loginSchema), authController.login);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh', refreshTokenMiddleware, authController.refreshToken);

// ==================== PROTECTED ROUTES ====================

/**
 * POST /api/v1/auth/logout
 * Logout current session
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * POST /api/v1/auth/logout-all-devices
 * Logout all sessions
 */
router.post('/logout-all-devices', authMiddleware, authController.logoutAllDevices);

/**
 * GET /api/v1/auth/profile
 * Get current user profile
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * GET /api/v1/auth/sessions
 * Get all active sessions
 */
router.get('/sessions', authMiddleware, authController.getSessions);

/**
 * POST /api/v1/auth/change-password
 * Change user password
 */
router.post('/change-password', authMiddleware, authController.changePassword);

// ==================== DEVELOPMENT ROUTES ====================

/**
 * GET /api/v1/auth/dev/credentials
 * List all registered accounts (DEVELOPMENT ONLY - shows credentials for testing)
 */
if (process.env.NODE_ENV === 'development') {
  router.get('/dev/credentials', (req, res) => {
    try {
      const fs = require('fs');
      const path = require('path');
      const usersFile = path.join(__dirname, '../data/users.json');
      
      if (fs.existsSync(usersFile)) {
        const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
        const credentials = users.map(u => ({
          email: u.email,
          username: u.username,
          firstName: u.firstName,
          lastName: u.lastName,
          createdAt: u.createdAt
        }));
        
        return res.status(200).json({
          success: true,
          message: `Found ${credentials.length} registered accounts`,
          data: credentials
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'No registered accounts yet',
        data: []
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error fetching credentials',
        error: error.message
      });
    }
  });
}

module.exports = router;
