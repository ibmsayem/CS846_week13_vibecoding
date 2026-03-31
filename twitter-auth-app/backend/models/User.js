/**
 * MOCK DATABASE - In-memory storage with file persistence
 * In production, replace with PostgreSQL
 */

const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

// Data persistence paths
const dataDir = path.join(__dirname, '../data');
const usersFile = path.join(dataDir, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created data directory:', dataDir);
}

// Load users from file or create empty array
const loadUsersFromFile = () => {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading users from file:', error.message);
  }
  return [];
};

// Save users to file
const saveUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving users to file:', error.message);
  }
};

// Mock data storage
const mockDB = {
  users: loadUsersFromFile(),
  sessions: [],
  passwordResets: [],
  emailVerifications: []
};

// ==================== USER OPERATIONS ====================

/**
 * Create a new user
 */
const createUser = async (userData) => {
  const userId = uuidv4();
  
  const user = {
    id: userId,
    email: userData.email,
    username: userData.username,
    passwordHash: userData.passwordHash,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    bio: userData.bio || "", // New field for user bio
    profilePicture: userData.profilePicture || "", // New field for profile picture URL
    isVerified: true,  // Auto-verify users on signup (no email verification required)
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockDB.users.push(user);
  saveUsersToFile(mockDB.users); // Save to file
  console.log('💾 User saved to file:', user.email);
  return user;
};

/**
 * Find user by email
 */
const findUserByEmail = async (email) => {
  return mockDB.users.find(u => u.email === email);
};

/**
 * Find user by username
 */
const findUserByUsername = async (username) => {
  return mockDB.users.find(u => u.username === username);
};

/**
 * Find user by ID
 */
const findUserById = async (userId) => {
  return mockDB.users.find(u => u.id === userId);
};

/**
 * Update user
 */
const updateUser = async (userId, updates) => {
  const user = mockDB.users.find(u => u.id === userId);
  if (!user) return null;
  
  Object.assign(user, updates, { updatedAt: new Date() });
  saveUsersToFile(mockDB.users); // Save to file
  console.log('💾 User updated and saved:', userId);
  return user;
};

// Add profile fields to the User model
class User {
  constructor(id, email, username, passwordHash, firstName, lastName, bio = "", profilePicture = "") {
    this.id = id;
    this.email = email;
    this.username = username;
    this.passwordHash = passwordHash;
    this.firstName = firstName;
    this.lastName = lastName;
    this.bio = bio; // New field for user bio
    this.profilePicture = profilePicture; // New field for profile picture URL
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  updateProfile({ bio, profilePicture }) {
    if (bio) this.bio = bio;
    if (profilePicture) this.profilePicture = profilePicture;
    this.updatedAt = new Date();
  }
}

// ==================== SESSION OPERATIONS ====================

/**
 * Create a new session
 */
const createSession = async (userId, refreshToken) => {
  const session = {
    id: uuidv4(),
    userId,
    refreshToken,
    deviceName: null,
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  };
  
  mockDB.sessions.push(session);
  return session;
};

/**
 * Find session by refresh token
 */
const findSessionByRefreshToken = async (refreshToken) => {
  return mockDB.sessions.find(s => s.refreshToken === refreshToken);
};

/**
 * Get all sessions for a user
 */
const getUserSessions = async (userId) => {
  return mockDB.sessions.filter(s => s.userId === userId);
};

/**
 * Delete session
 */
const deleteSession = async (sessionId) => {
  const index = mockDB.sessions.findIndex(s => s.id === sessionId);
  if (index !== -1) {
    mockDB.sessions.splice(index, 1);
    return true;
  }
  return false;
};

/**
 * Delete all sessions for a user
 */
const deleteUserSessions = async (userId) => {
  const initialLength = mockDB.sessions.length;
  mockDB.sessions = mockDB.sessions.filter(s => s.userId !== userId);
  return initialLength - mockDB.sessions.length;
};

// ==================== PASSWORD RESET OPERATIONS ====================

/**
 * Create password reset token
 */
const createPasswordReset = async (userId, token) => {
  const reset = {
    id: uuidv4(),
    userId,
    token,
    used: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  };
  
  mockDB.passwordResets.push(reset);
  return reset;
};

/**
 * Find password reset by token
 */
const findPasswordResetByToken = async (token) => {
  return mockDB.passwordResets.find(r => r.token === token && !r.used);
};

/**
 * Mark password reset as used
 */
const markPasswordResetAsUsed = async (resetId) => {
  const reset = mockDB.passwordResets.find(r => r.id === resetId);
  if (reset) {
    reset.used = true;
    reset.usedAt = new Date();
  }
  return reset;
};

// ==================== EMAIL VERIFICATION OPERATIONS ====================

/**
 * Create email verification token
 */
const createEmailVerification = async (userId, token) => {
  const verification = {
    id: uuidv4(),
    userId,
    token,
    verified: false,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
  };
  
  mockDB.emailVerifications.push(verification);
  return verification;
};

/**
 * Find email verification by token
 */
const findEmailVerificationByToken = async (token) => {
  return mockDB.emailVerifications.find(v => v.token === token && !v.verified);
};

/**
 * Mark email as verified
 */
const markEmailAsVerified = async (verificationId) => {
  const verification = mockDB.emailVerifications.find(v => v.id === verificationId);
  if (verification) {
    verification.verified = true;
    verification.verifiedAt = new Date();
  }
  return verification;
};

// ==================== DEBUG UTILITIES ====================

/**
 * Get all users (debug only)
 */
const getAllUsers = () => {
  return mockDB.users.map(u => {
    const { passwordHash, ...rest } = u;
    return rest;
  });
};

/**
 * Clear all data (for testing)
 */
const clearAllData = () => {
  mockDB.users = [];
  mockDB.sessions = [];
  mockDB.passwordResets = [];
  mockDB.emailVerifications = [];
};

/**
 * Initialize test user (for development)
 */
const initializeTestUser = async () => {
  const bcrypt = require('bcryptjs');
  
  // Check if test user already exists
  const existingTestUser = await findUserByEmail('testuser@example.com');
  if (existingTestUser) {
    return existingTestUser;
  }

  // Hash password for test user
  const hashedPassword = await bcrypt.hash('TestPassword123!', 12);

  // Create test user
  const testUser = await createUser({
    email: 'testuser@example.com',
    username: 'testuser',
    passwordHash: hashedPassword,
    firstName: 'Test',
    lastName: 'User'
  });

  return testUser;
};

module.exports = {
  // User operations
  createUser,
  findUserByEmail,
  findUserByUsername,
  findUserById,
  updateUser,
  
  // Session operations
  createSession,
  findSessionByRefreshToken,
  getUserSessions,
  deleteSession,
  deleteUserSessions,
  
  // Password reset operations
  createPasswordReset,
  findPasswordResetByToken,
  markPasswordResetAsUsed,
  
  // Email verification operations
  createEmailVerification,
  findEmailVerificationByToken,
  markEmailAsVerified,
  
  // Debug utilities
  getAllUsers,
  clearAllData,
  initializeTestUser
};
