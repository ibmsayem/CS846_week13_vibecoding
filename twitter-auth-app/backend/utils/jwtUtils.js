const jwt = require('jsonwebtoken');

const getJWTSecret = () => {
  const secret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_change_in_production_12345';
  if (!secret) {
    throw new Error('JWT_SECRET is not set in environment variables');
  }
  return secret;
};

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '900'; // 15 minutes
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '604800'; // 7 days

/**
 * Generate access token
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId) => {
  try {
    return jwt.sign(
      { userId, type: 'access' },
      getJWTSecret(),
      { expiresIn: parseInt(JWT_EXPIRES_IN) }
    );
  } catch (error) {
    throw new Error('Failed to generate access token: ' + error.message);
  }
};

/**
 * Generate refresh token
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  try {
    return jwt.sign(
      { userId, type: 'refresh' },
      getJWTSecret(),
      { expiresIn: parseInt(JWT_REFRESH_EXPIRES_IN) }
    );
  } catch (error) {
    throw new Error('Failed to generate refresh token: ' + error.message);
  }
};

/**
 * Generate both access and refresh tokens
 * @param {string} userId - User ID
 * @returns {object} Object with accessToken and refreshToken
 */
const generateTokenPair = (userId) => {
  return {
    accessToken: generateAccessToken(userId),
    refreshToken: generateRefreshToken(userId)
  };
};

/**
 * Verify and decode token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, getJWTSecret());
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {object} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    throw new Error('Failed to decode token: ' + error.message);
  }
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Token or null if not valid format
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokenPair,
  verifyToken,
  decodeToken,
  extractTokenFromHeader,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN
};
