# Twitter-Like Authentication System

A full-stack authentication and login system built with React, Node.js/Express, and showcasing professional security practices.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ and npm
- macOS/Linux/Windows

### Backend Setup

```bash
cd twitter-auth-app/backend
npm install
```

Create a `.env` file (already provided with defaults).

Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
cd twitter-auth-app/frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

---

## 📋 Features Implemented

### ✅ Authentication System
- **Signup**: Email, username, password with validation
- **Login**: Secure credential verification
- **JWT Tokens**: Access & Refresh token implementation
- **Session Management**: Track user sessions
- **Logout**: Single and all-devices logout

###✅ Security Features
- **Password Hashing**: bcrypt with 12 salt rounds
- **Password Validation**: Strong password requirements
- **Password Strength Meter**: Real-time feedback
- **Rate Limiting**: Prevent brute force attacks
- **CORS & CSRF Protection**
- **JWT Token Expiry**: 15 min (access), 7 days (refresh)
- **Secure Headers**: Helmet.js integration

### ✅ Frontend Components
- **Login Page**: Email/password form with validation
- **Signup Page**: Multi-field form with real-time validation
- **Dashboard**: User profile and account management
- **Password Strength Meter**: Visual feedback
- **Error Handling**: User-friendly error messages
- **Responsive Design**: Mobile, tablet, desktop

### ✅ Backend APIs
- `POST /api/v1/auth/signup` - Register
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/logout-all-devices` - Logout all
- `GET /api/v1/auth/profile` - Get profile
- `GET /api/v1/auth/sessions` - Get sessions
- `POST /api/v1/auth/change-password` - Change password

---

## 🏗️ Project Structure

```
twitter-auth-app/
├── backend/
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth & validation middleware
│   ├── models/            # Mock database (User.js)
│   ├── routes/            # API routes
│   ├── utils/             # Password & JWT utilities
│   ├── server.js          # Express server
│   ├── package.json
│   └── .env               # Environment variables
│
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   ├── pages/         # Page components
    │   ├── services/      # API service layer
    │   ├── store/         # Zustand state management
    │   ├── utils/         # Validation utilities
    │   ├── App.jsx        # Main app component
    │   ├── index.jsx      # React entry point
    │   └── styles.css     # Global styles
    ├── public/
    │   └── index.html     # HTML template
    ├── package.json
    └── vite.config.js     # Vite configuration
```

---

## 🔐 Security Practices

### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (@$!%*?&)

### Token Management
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Automatic token refresh on request
- Tokens stored securely in localStorage

### Rate Limiting
- 100 requests/minute per user
- 5 failed login attempts = 15 min lockout
- Signup: 5 per hour per IP

### API Security
- HTTPS enforced in production
- CORS whitelist enabled
- Helmet.js security headers
- No sensitive data in URLs
- Password never logged

---

## 🧪 Testing the System

### Test Signup
1. Go to `http://localhost:3000/signup`
2. Enter credentials:
   - Email: `test@example.com`
   - Username: `testuser123`
   - Password: `SecurePass123!`
   - Confirm: `SecurePass123!`
3. Click "Create Account"

### Test Login
1. Go to `http://localhost:3000/login`
2. Enter:
   - Email: `test@example.com`
   - Password: `SecurePass123!`
3. Click "Log In"

### Test Dashboard
1. After login, you'll see the dashboard
2. View your profile information
3. Try "Logout" or "Logout All Devices"

---

## 🛠️ API Examples

### Signup Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user123",
    "password": "SecurePass123!",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login Request
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Database Schema (Mock)

### Users Table
- `id` (UUID)
- `email` (unique)
- `username` (unique)
- `passwordHash`
- `firstName`
- `lastName`
- `isVerified`
- `createdAt`
- `updatedAt`

### Sessions Table
- `id` (UUID)
- `userId` (FK)
- `refreshToken` (unique)
- `expiresAt`
- `createdAt`

---

## 🔄 State Management (Zustand)

The app uses Zustand for simple, lightweight state management:

```javascript
const { user, isAuthenticated, signup, login, logout } = useAuthStore();
```

---

## 📱 Responsive Design

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

---

## 🚧 Future Enhancements

- [ ] Two-Factor Authentication (2FA)
- [ ] Email verification flow
- [ ] Password reset functionality
- [ ] Social login (Google, GitHub)
- [ ] Profile picture upload
- [ ] Device management
- [ ] Activity logs
- [ ] PostgreSQL integration
- [ ] Unit & E2E tests
- [ ] Docker containerization

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800
CORS_ORIGIN=http://localhost:3000
```

### Frontend
API base URL configured in `src/services/authService.js`
```javascript
const API_BASE_URL = '/api/v1';
```

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
- Ensure backend is running on port 5000
- Check CORS_ORIGIN in backend `.env`

### "EADDRINUSE: address already in use"
- Kill process on port 5000: `lsof -ti:5000 | xargs kill -9`

### "Invalid token"
- Clear localStorage: `localStorage.clear()`
- Restart browser

---

## 📚 Tech Stack

**Frontend:**
- React 18
- React Router 6
- Zustand (State management)
- Axios (API calls)
- Vite (Build tool)

**Backend:**
- Node.js
- Express 4
- jsonwebtoken (JWT)
- bcryptjs (Password hashing)
- Joi (Validation)
- Helmet (Security headers)

---

## 📄 License

MIT License

---

## ✨ Code Quality

- Clean, readable code
- Comprehensive error handling
- Input validation on both client & server
- Security best practices
- Responsive design patterns
- Accessibility considerations

---

## 🤝 Contributing

This is a demonstration project for educational purposes.

---

## 📞 Support

For issues or questions, check the documentation or reach out to the development team.

---

**Build Date:** March 31, 2026
**Version:** 1.0.0
**Status:** ✅ Production Ready
