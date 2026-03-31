const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug: Log environment variables
console.log('DEBUG: JWT_SECRET loaded:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('DEBUG: NODE_ENV:', process.env.NODE_ENV);

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet()); // Set security HTTP headers

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS),
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// ==================== ROUTES ====================

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Twitter-like Auth API',
    version: '1.0.0',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth'
    }
  });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes (to be implemented)
app.use('/api/v1/auth', require('./routes/auth'));

// User routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/v1/users', userRoutes);

// Post routes
const postRoutes = require('./routes/postRoutes');
app.use('/api/v1/posts', postRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== SERVER STARTUP ====================

const User = require('./models/User');

const server = app.listen(PORT, async () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  
  // Initialize test user for development
  if (process.env.NODE_ENV === 'development') {
    try {
      const testUser = await User.initializeTestUser();
      console.log('🧪 Test user initialized: testuser@example.com');
      console.log('📊 Persistent storage enabled - users saved to backend/data/users.json');
    } catch (error) {
      console.error('⚠️ Failed to initialize test user:', error.message);
    }
  }
});

// Handle server errors
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
    console.log(`💡 Try: lsof -ti:${PORT} | xargs kill -9`);
    process.exit(1);
  }
  throw err;
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;
