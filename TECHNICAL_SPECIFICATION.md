# Twitter-Like Auth App - Technical Specification

## 1. PROJECT-SPECIFIC TOOLS & WORKFLOW EXECUTION MECHANICS

### Backend Tools
| Tool | Version | Purpose | Workflow |
|------|---------|---------|----------|
| Node.js | 14+ | Runtime environment | Executes server logic |
| Express.js | 4.18.2 | Web framework | Handles HTTP requests/responses |
| Vite | 8.0.3 | Frontend build tool | Hot module replacement (HMR) during dev |
| npm | Latest | Package manager | Dependency management |

### Backend Workflow Mechanics
```
Client Request
    ↓
[CORS Middleware] → Validates origin
    ↓
[Rate Limiter] → Checks request quota (100 req/min per user)
    ↓
[Body Parser] → Parses JSON/form data
    ↓
[Validation Middleware] → Validates input (Joi schema)
    ↓
[Auth Middleware] → Verifies JWT token (if protected route)
    ↓
[Controller] → Business logic (signup/login/refresh)
    ↓
[User Model] → Mock database operations
    ↓
[Response Handler] → Returns JSON response
    ↓
Client Response
```

### Frontend Workflow Mechanics
```
User Action (Click Login/Signup)
    ↓
[React Event Handler] → Validate form inputs
    ↓
[Zustand Store] → Dispatch async action
    ↓
[Axios Service] → HTTP request + token management
    ↓
[API Interceptor] → Add Authorization header + handle token refresh
    ↓
[Backend] → Process request
    ↓
[Response Handler] → Extract tokens, store in localStorage
    ↓
[Update Store] → Set user + isAuthenticated
    ↓
[React Router] → Navigate to next page
    ↓
[UI Render] → Display dashboard/error
```

---

## 2. REQUIRED EXTERNAL LIBRARIES & PACKAGES

### Backend Dependencies

| Package | Version | Purpose | Key Functions |
|---------|---------|---------|---|
| `express` | ^4.18.2 | Web server framework | `app.get()`, `app.post()`, `app.use()` |
| `bcryptjs` | ^2.4.3 | Password hashing | `bcrypt.hash()`, `bcrypt.compare()` |
| `jsonwebtoken` | ^9.0.0 | JWT token generation | `jwt.sign()`, `jwt.verify()` |
| `dotenv` | ^16.0.3 | Environment variables | `require('dotenv').config()` |
| `cors` | ^2.8.5 | Cross-origin requests | `cors({ origin: URL })` |
| `helmet` | ^7.0.0 | Security headers | `helmet()` middleware |
| `express-rate-limit` | ^6.7.0 | Rate limiting | `rateLimit({ max: 100 })` |
| `joi` | ^17.9.1 | Input validation | `Joi.object().validate()` |
| `uuid` | ^9.0.0 | Unique identifiers | `v4()` for IDs |
| `axios` | ^1.3.0 | HTTP client | `axios.get()`, `axios.post()` |

### Frontend Dependencies

| Package | Version | Purpose | Key API |
|---------|---------|---------|---|
| `react` | ^18.2.0 | UI library | `useState()`, `useEffect()` hooks |
| `react-dom` | ^18.2.0 | DOM rendering | `ReactDOM.createRoot()` |
| `react-router-dom` | ^6.12.0 | Client-side routing | `<Routes>`, `<Route>`, `useNavigate()` |
| `axios` | ^1.3.0 | HTTP requests | `axios.post()`, interceptors |
| `zustand` | ^4.3.7 | State management | `create()` store |
| `vite` | ^4.3.9 | Build tool | Dev server, HMR |
| `@vitejs/plugin-react` | ^4.0.0 | React support for Vite | JSX compilation |

### Dev Dependencies

| Package | Purpose |
|---------|---------|
| `nodemon` (backend) | Auto-restart on file changes |
| `jest` (backend) | Unit testing |
| `supertest` (backend) | HTTP testing |

---

## 3. INPUT TYPE & OUTPUT FORMAT

### Authentication Endpoints Input/Output

#### **POST /api/v1/auth/signup**

**Input (Request Body):**
```json
{
  "email": "string (email format)",
  "username": "string (3-30 alphanumeric)",
  "password": "string (8+ chars, uppercase, lowercase, number, special char)",
  "firstName": "string (optional, max 100 chars)",
  "lastName": "string (optional, max 100 chars)"
}
```

**Output (Success - 201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "test@example.com",
      "username": "testuser",
      "firstName": "John",
      "lastName": "Doe",
      "isVerified": false,
      "createdAt": "2026-03-31T17:00:00.000Z",
      "updatedAt": "2026-03-31T17:00:00.000Z"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "jwt_token"
    }
  }
}
```

**Output (Error - 400/409):**
```json
{
  "success": false,
  "message": "Email already registered",
  "errors": [
    {
      "field": "email",
      "message": "Email already in use"
    }
  ]
}
```

---

#### **POST /api/v1/auth/login**

**Input (Request Body):**
```json
{
  "email": "string (email format)",
  "password": "string (user's password)"
}
```

**Output (Success - 200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { /* user object */ },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "jwt_token"
    }
  }
}
```

**Output (Error - 401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

#### **POST /api/v1/auth/refresh**

**Input (Request Body):**
```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Output (Success - 200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "tokens": {
      "accessToken": "new_jwt_access_token",
      "refreshToken": "new_jwt_refresh_token"
    }
  }
}
```

---

#### **GET /api/v1/auth/profile**

**Input (Header):**
```
Authorization: Bearer <access_token>
```

**Output (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "test@example.com",
    "username": "testuser",
    "firstName": "John",
    "lastName": "Doe",
    "isVerified": false,
    "createdAt": "2026-03-31T17:00:00.000Z"
  }
}
```

---

### Frontend Form Input/Output

#### **Signup Form Input**
```javascript
{
  email: "test@example.com",           // Email validation required
  username: "testuser123",             // Alphanumeric only, 3-30 chars
  password: "SecurePass123!",          // Must match requirements
  confirmPassword: "SecurePass123!",   // Must match password
  firstName: "John",                   // Optional
  lastName: "Doe"                      // Optional
}
```

#### **Login Form Input**
```javascript
{
  email: "test@example.com",
  password: "SecurePass123!"
}
```

#### **Frontend Output (UI State)**
```javascript
// Zustand Store State
{
  user: {
    id: "uuid",
    email: "test@example.com",
    username: "testuser",
    // ... other user fields
  },
  isAuthenticated: true,
  isLoading: false,
  error: null
}
```

---

## 4. ERROR HANDLING & EDGE CASES

### Backend Error Cases

| Error Case | HTTP Status | Message | Recovery |
|-----------|------------|---------|----------|
| Invalid email format | 400 | "Please provide a valid email address" | Validate before submit |
| Email already exists | 409 | "Email already registered" | Use different email |
| Weak password | 400 | First validation error + list | Follow requirements |
| Missing required field | 400 | "Field is required" | Fill all fields |
| Invalid credentials | 401 | "Invalid credentials" | Check email/password |
| Token expired | 401 | "Token has expired" | Auto-refresh or re-login |
| Invalid token format | 401 | "Invalid authorization format" | Reset localStorage |
| Rate limit exceeded | 429 | "Too many requests" | Wait before retrying |
| Account locked | 423 | "Account temporarily locked" | Wait 15 minutes |
| Database error | 500 | "Internal server error" | Retry request |

### Frontend Error Cases

| Error Case | UI Behavior | User Feedback |
|-----------|------------|---|
| Network timeout | Disable button, show spinner | "Connection timeout. Please try again." |
| Invalid form data | Highlight field, show error | "Email must be valid format" |
| API returns 409 (conflict) | Clear password fields, show error | "This email is already registered" |
| Token refresh fails | Clear storage, redirect to login | "Session expired. Please login again." |
| CORS error | Show generic error | "Connection error. Please refresh page." |

---

## 5. DATABASE SCHEMA (MOCK - In-Memory)

### Users Table
```javascript
{
  id: "uuid",
  email: "unique string",
  username: "unique string",
  passwordHash: "bcrypt hash",
  firstName: "string or null",
  lastName: "string or null",
  isVerified: "boolean",
  isBusinessAccount: "boolean",
  createdAt: "Date",
  updatedAt: "Date"
}
```

### Sessions Table
```javascript
{
  id: "uuid",
  userId: "uuid (FK)",
  refreshToken: "unique jwt string",
  deviceName: "string or null",
  ipAddress: "string or null",
  userAgent: "string or null",
  createdAt: "Date",
  expiresAt: "Date (7 days)"
}
```

### Password Resets Table
```javascript
{
  id: "uuid",
  userId: "uuid (FK)",
  token: "unique string",
  used: "boolean",
  createdAt: "Date",
  expiresAt: "Date (1 hour)"
}
```

---

## 6. SECURITY SPECIFICATIONS

### Password Security
- **Hash Algorithm**: bcrypt with 12 salt rounds
- **Storage**: Only hash stored, never plain text
- **Requirements**: 8+ chars, uppercase, lowercase, number, special char
- **Strength Meter**: Real-time feedback (0-100%)

### Token Security
- **Algorithm**: JWT (HS256)
- **Access Token**: 15 minutes expiry
- **Refresh Token**: 7 days expiry
- **Storage**: localStorage (frontend)
- **Transmission**: Authorization Bearer header (HTTPS only in production)

### Rate Limiting
- **General API**: 100 requests/minute per user
- **Login**: 5 failed attempts = 15 min lockout
- **Signup**: 5 per hour per IP
- **Password Reset**: 3 per hour per email

### CORS & CSRF Protection
- **CORS Origins**: Only allow configured domains
- **Headers**: Content-Type, Authorization only
- **Methods**: GET, POST, PUT, DELETE
- **Credentials**: true (for cross-domain cookies)

### Data Protection
- **HTTPS**: Required in production (TLS 1.3 min)
- **Encryption**: Passwords hashed with bcrypt
- **PII Handling**: No passwords in logs, tokens hashed
- **Session Timeout**: 15 minutes inactivity

---

## 7. WORKFLOW EXECUTION SEQUENCE

### Signup Complete Flow
```
1. User enters form data
2. Frontend validates locally (format, required fields)
3. Frontend calculates password strength
4. User clicks "Create Account"
5. Frontend disables button, shows spinner
6. Axios POST to /api/v1/auth/signup + timeout
7. Backend Rate Limiter checks IP (5 per hour)
8. Backend Validation middleware validates schema (Joi)
9. Backend checks email uniqueness
10. Backend checks username uniqueness
11. Backend validates password strength
12. Backend hashes password with bcrypt (12 rounds)
13. Backend creates user in mock DB
14. Backend generates token pair (JWT)
15. Backend creates session record
16. Backend stores tokens in localStorage
17. Backend returns user + tokens (201)
18. Frontend Zustand store updates
19. Frontend redirects to /dashboard
20. Frontend displays user profile
```

### Login Complete Flow
```
1. User enters email + password
2. Frontend validates inputs
3. Frontend POST to /api/v1/auth/login
4. Backend Rate Limiter checks (5 failures = 15 min lockout)
5. Backend finds user by email
6. Backend bcrypt.compare(password, hash)
7. If mismatch: Return 401 "Invalid credentials"
8. If match: Generate token pair
9. Backend creates session
10. Backend stores tokens + refreshToken
11. Backend returns user + tokens (200)
12. Frontend stores in localStorage
13. Frontend updates Zustand store
14. Frontend redirects to /dashboard
15. Frontend axios interceptor sets Authorization header
16. Next requests include Bearer token
```

### Token Refresh Flow
```
1. Frontend makes API request with expired access token
2. Backend returns 401 Unauthorized
3. Axios interceptor catches 401
4. Interceptor extracts refreshToken from localStorage
5. Interceptor POST to /api/v1/auth/refresh
6. Backend verifies refresh token
7. Backend generates new token pair
8. Backend returns new tokens
9. Interceptor stores new tokens
10. Interceptor retries original request with new token
11. Request succeeds
12. User doesn't notice interruption
```

---

## 8. CONFIGURATION & ENVIRONMENT VARIABLES

### Backend (.env)
```
PORT=5001
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRES_IN=900
JWT_REFRESH_EXPIRES_IN=604800
DB_HOST=localhost
DB_PORT=5432
DB_NAME=twitter_auth_db
EMAIL_SERVICE=gmail
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PASSWORD_MIN_LENGTH=8
```

### Frontend Vite Config
```javascript
{
  root: './',
  publicDir: 'public',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true
      }
    }
  }
}
```

---

## 9. DEPLOYMENT CHECKLIST

### Backend Deployment
- [ ] Change JWT_SECRET to strong random string
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS only
- [ ] Set CORS_ORIGIN to production domain
- [ ] Setup PostgreSQL database
- [ ] Configure monitoring/logging
- [ ] Setup CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Configure rate limiting per user ID (not IP)
- [ ] Enable HSTS headers

### Frontend Deployment
- [ ] Run `npm run build`
- [ ] Update API base URL to production
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Configure cache headers
- [ ] Setup analytics
- [ ] Test on all browsers
- [ ] Optimize images
- [ ] Setup error tracking
- [ ] Configure CSP headers

---

## 10. TESTING STRATEGY

### Unit Tests (Backend)
```javascript
// Password validation
test('strong password passes validation')
test('weak password fails validation')
test('bcrypt hash verification works')

// Token generation
test('JWT token generates correctly')
test('JWT token expires properly')
test('Invalid token rejected')

// Validation schemas
test('Valid signup data passes Joi schema')
test('Invalid email rejected')
test('Duplicate email rejected')
```

### Integration Tests (Backend)
```javascript
test('Signup → Email Verification → Login flow')
test('Login → Token Refresh → Logout flow')
test('Password Reset flow')
test('Rate limiting enforces limits')
test('Session management works correctly')
```

### E2E Tests (Frontend + Backend)
```javascript
test('User can signup successfully')
test('User receives error on invalid email')
test('User can login after signup')
test('Session persists on page refresh')
test('User is logged out after timeout')
test('Password strength meter updates in real-time')
```

---

## 11. PERFORMANCE METRICS

| Metric | Target | Threshold |
|--------|--------|-----------|
| Signup response time | < 500ms | 1000ms |
| Login response time | < 200ms | 500ms |
| Token refresh time | < 100ms | 200ms |
| Frontend bundle size | < 150KB | 300KB |
| API throughput | 1000 req/sec | 100 req/sec (fail) |
| Database query time | < 50ms | 200ms |
| Session creation time | < 20ms | 100ms |

---

## 12. MONITORING & LOGGING

### Backend Logging
```javascript
// Auth events
- Signup attempt (success/failure)
- Login attempt (success/failure/locked)
- Token refresh (success/failure)
- Password change events
- Session creation/termination
- Rate limit triggers
- Security events (XSS attempts, SQL injection attempts)
```

### Frontend Logging
```javascript
- User navigation events
- Form submission attempts
- API request/response times
- Error events
- Storage events (localStorage access)
```

---

## 13. DEVELOPMENT GUIDELINES APPLICATION

This project applies 8 core software development principles throughout its architecture and implementation workflow:

### Guideline 1: Requirements - Define Clear Specifications

**Application to Project:**

The platform was specified with concrete requirements before implementation:
- **User Authentication:** Signup with validation (email format, password strength), login with JWT tokens, automatic token refresh
- **Role Assignment:** Creator role has edit/delete permissions on their own posts; users cannot modify others' content
- **Edge Cases:** Handle multiple concurrent logins, expired tokens, invalid credentials, duplicate email registration

**Example from Codebase:**
```javascript
// Backend: Strict input validation before processing
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(passwordRegex).required()
});
const { error, value } = schema.validate(req.body);

// Frontend: Authorization checks before rendering delete buttons
{post.userId === user.id && (
  <button onClick={() => handleDeletePost(post.id)}>🗑️</button>
)}
```

**Lessons Applied:**
- Define role-based permissions upfront
- Validate all inputs against strict schemas
- Test edge cases: token expiration, network failures, concurrent requests

---

### Guideline 2: Code Generation - Iterative Cycles with Project Tools

**Application to Project:**

Code development followed an iterative generate-refine-deploy cycle:
1. **Initial Implementation:** Create basic CRUD endpoints and React components
2. **Generate & Test:** Build authorization checks and test with curl/browser
3. **Refine:** Fix authorization bugs (e.g., `user.userId` → `user.id`), clean up display logic
4. **Deploy:** Update frontend to reflect backend changes

**Example from Codebase:**
```javascript
// Iteration 1: Basic post creation
POST /posts → Create post

// Iteration 2: Add authorization
DELETE /posts/:id → Check if userId matches before deletion

// Iteration 3: Bug fix detected
// Issue: post.userId === user.userId always false (user has 'id' not 'userId')
// Fixed: post.userId === user.id
```

**Lessons Applied:**
- Use project-specific tools (curl for backend, React DevTools for frontend)
- Test incrementally after each change
- Debug systematically: check backend responses first, then frontend state

---

### Guideline 3: Testing - Generate-Validate-Repair Loop

**Application to Project:**

Testing strategy includes clear goals and validation:

**Test Goals:**
- Authenticate users (signup/login)
- Users see only their action buttons on own content
- Authorization prevents unauthorized operations
- Session persists across page reloads

**Validation & Testing:**
```bash
# Backend validation with curl
curl -X POST http://localhost:5001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"Password123!"}'

# Expected: Token returned + user object

# Frontend validation: Inspect console logs
console.log('User from store:', user)  // Verify user.id exists
console.log('Post creator check:', post.userId === user.id)  // Should be true
```

**Repair Cycle:**
- Test failed? → Inspect backend logs
- Check API response structure
- Verify frontend state matches expectation
- Apply fix and retest

---

### Guideline 4: Debugging - Collaborate & Self-Debug

**Application to Project:**

Debugging workflow implemented in three layers:

**Layer 1: Self-Debug with Logs**
```javascript
// Backend: Log authentication flow
console.log('Login attempt:', email);
console.log('User found:', user !== null);
console.log('Password match:', passwordMatch);

// Frontend: Log authorization checks
console.log('Checking delete permission for post:', post.id);
console.log('Current user ID:', user.id);
console.log('Post user ID:', post.userId);
console.log('Can delete?', post.userId === user.id);
```

**Layer 2: Debug Endpoints**
```javascript
// GET /debug/users → List all users (development only)
// Helps verify data structure matches expectations
```

**Layer 3: Edge Case Testing**
- Try to delete someone else's post (should fail)
- Login while token expiring (should refresh)
- Rapid successive requests (should respect rate limits)

**Bug Resolution Example:**
- **Symptom:** Delete button not showing, delete fails
- **Investigation:** Log authorization check result
- **Root Cause:** `user.userId` undefined, comparison always false
- **Fix:** Change to `user.id`
- **Verification:** Log shows comparison now true, button appears

---

### Guideline 5: Code Summarization - Document Purpose & Architecture

**Application to Project:**

Each major component documented with purpose and interface:

**Example 1: Post Controller**
```javascript
// PURPOSE: Handle post CRUD operations
// CONTRACT: 
//   Input: POST body with {content, userId}
//   Output: {success: boolean, data: post|error}
// LIFECYCLE:
//   1. Validate input (content not empty)
//   2. Check authorization (userId matches user.id)
//   3. Update in-memory database
//   4. Return updated post

exports.updatePost = async (req, res) => {
  // Implementation...
}
```

**Example 2: HomePage Component**
```javascript
// PURPOSE: Display feed of all posts with CRUD actions
// GLOBAL PLAN:
//   1. Fetch all posts on mount via GET /posts
//   2. For each post, check if user is creator
//   3. Show edit/delete buttons only if authorized
//   4. Handle like, reply, edit, delete operations
// DEPENDENCIES: useEffect, useState, useNavigate, useUserStore

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  // Implementation...
}
```

---

### Guideline 6: Code Review - Understand Intent, Document Risks

**Application to Project:**

Code review process verifies correct implementation of requirements:

**Review Checklist:**
- ✅ Authorization check present (no unauthorized edit/delete)
- ✅ Input validation applied (prevent injection attacks)
- ✅ Error handling in try-catch blocks
- ✅ Token refresh logic on 401 responses
- ✅ User feedback on success/failure
- ✅ No sensitive data logged (passwords, tokens)

**Regression Risk Assessment:**
```javascript
// RISKY: Changing authorization check
// OLD: post.userId === user.userId
// NEW: post.userId === user.id
// RISK: If user object structure changes elsewhere, this breaks again
// MITIGATION: Add type definitions or validation layer

// SAFE: Adding new feature (e.g., reply likes)
// No impact on existing authorization or CRUD operations
// Can test independently
```

---

### Guideline 7: Performance - Worst Case Optimization

**Application to Project:**

Performance considerations at scale:

**Problem: Profile loads user's 1000+ posts**
```javascript
// Worst case: O(1000) posts × 5-10 replies each
// Current: Fetch all posts, render all components
// Result: Browser hangs, memory bloat

// Solution: Pagination
// Fetch 10 posts per page
// Load more on scroll (infinite scroll)
// Reduces DOM nodes from 10,000 to ~50
```

**Problem: Real-time updates**
```javascript
// Worst case: 100+ concurrent users, 1000+ posts
// Current: Frontend polls every 5 seconds
// Result: 100,000 API calls/min overload

// Solution: Server-sent events or WebSocket
// Push updates only when posts change
// Reduces calls 99%
```

**Profiler Traces (theoretical):**
- HomePage render: 45ms (acceptable)
- Post CRUD: 120ms (need optimization at 1000+ posts)
- Authentication flow: 80ms (acceptable)
- Token refresh: 30ms (acceptable)

---

### Guideline 8: Logging - Consistent Structure & Abstraction Levels

**Application to Project:**

Multi-level logging strategy:

**Level 1: Info (User Actions)**
```javascript
logger.info('User logged in', { userId, email, timestamp });
logger.info('Post created', { postId, userId, wordCount });
```

**Level 2: Debug (Internal Flow)**
```javascript
logger.debug('Verifying token', { tokenId, expiresIn });
logger.debug('Updating post', { postId, changes });
```

**Level 3: Error (Problems)**
```javascript
logger.error('Login failed', { email, reason: 'invalid credentials' });
logger.error('Database error', { operation: 'createPost', error });
```

**Level 4: Security (Threats)**
```javascript
logger.security('Failed login attempt', { email, attempts: 5 });
logger.security('Unauthorized access attempt', { userId, resource: 'post/123' });
```

**Logging Abstraction:**
```javascript
// Structured format for parsing
// Consistent fields: timestamp, userId, action, result, duration
// Avoid logging: passwords, tokens, credit cards

// Example structured log
{
  "timestamp": "2026-03-31T17:00:00Z",
  "userId": "abc-123",
  "action": "delete_post",
  "resource": "post:xyz-789",
  "result": "success",
  "duration_ms": 45,
  "ip": "192.168.1.1"
}
```

---

## Supporting Documentation

- See [GUIDELINES_APPLICATION.md](./GUIDELINES_APPLICATION.md) for detailed guideline-to-implementation mapping
- Backend code follows guidelines in `/controllers/`, `/models/`, `/routes/`
- Frontend code follows guidelines in `/src/pages/`, `/src/components/`, `/src/store/`

