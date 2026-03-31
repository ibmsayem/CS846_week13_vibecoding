# User Data Persistence Guide

## Overview
The application now **persists user data locally** so you don't have to create new accounts every time you restart the server!

## How It Works

### Backend Storage
- User accounts are automatically saved to: `backend/data/users.json`
- This file is created automatically when you first sign up
- All user data persists between server restarts

### Data Saved
- Email address
- Username
- Password (bcrypt hashed - never stored in plain text)
- First name & Last name
- Profile information (bio, profile picture)
- Account creation timestamp

## Using Persisted Accounts

### Option 1: View Accounts on Login Page
1. Start the application
2. Go to the Login page
3. Click "🧪 Registered Test Accounts" to see all available accounts
4. Use any registered email to log in (you already know the password from signup)

### Option 2: Check the Data File Directly
```bash
# View all saved users (contains hashed passwords)
cat backend/data/users.json
```

### Option 3: Use the Development API
```bash
# List all registered accounts (development only)
curl http://localhost:5001/api/v1/auth/dev/credentials
```

## Available Test Accounts

### Pre-loaded Test User
- **Email:** testuser@example.com
- **Password:** TestPassword123!
- **User:** testuser
- Created automatically on first server start

### Your Registered Accounts
Any account you create via the signup page will be automatically saved and available for future logins!

## How to Delete/Reset Data

If you want to start fresh and delete all saved accounts:

```bash
# Option 1: Delete the data file
rm backend/data/users.json

# Option 2: Clear users from the JSON file
echo '[]' > backend/data/users.json
```

Then restart the server - the test user will be automatically re-created.

## Security Notes

⚠️ **Development Only**
- The `/api/v1/auth/dev/credentials` endpoint is **only available in development mode**
- Passwords are never exposed or displayed (stored as bcrypt hashes)
- The credentials display on the login page is for testing purposes only

## Example Workflow

```bash
# 1. Start the server
npm run dev:backend

# 2. The server shows:
# ✅ Server running on http://localhost:5001
# 🧪 Test user initialized: testuser@example.com
# 📊 Persistent storage enabled - users saved to backend/data/users.json

# 3. Sign up a new account via the frontend

# 4. Stop and restart the server
# Your new account is still there!

# 5. Login with either:
# - testuser@example.com / TestPassword123!
# - Your new account credentials
```

## File Structure

```
backend/
├── data/
│   ├── .gitkeep
│   └── users.json        ← User accounts are saved here
├── server.js
├── models/
│   └── User.js          ← Modified to persist data
└── ...
```

## Notes

- Data persists across server restarts ✅
- Each account is saved immediately after signup ✅
- Passwords are bcrypt hashed (secure) ✅
- No external database needed ✅
- Perfect for local development & testing ✅

