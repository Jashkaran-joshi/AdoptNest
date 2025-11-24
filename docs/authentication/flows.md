# Authentication Flows

## 🔐 Authentication Overview

The application uses JWT (JSON Web Tokens) for authentication.

## 📋 Authentication Flows

### 1. User Registration Flow

```
User → Signup Form → POST /api/auth/signup
  ↓
Backend validates data
  ↓
Check if user exists
  ↓
Create user (password hashed)
  ↓
Generate email verification token
  ↓
Send verification email (production)
  ↓
Generate JWT token
  ↓
Return user + token
  ↓
Frontend stores token in localStorage
  ↓
User logged in
```

### 2. User Login Flow

```
User → Login Form → POST /api/auth/login
  ↓
Backend validates credentials
  ↓
Find user by email
  ↓
Check password (bcrypt compare)
  ↓
Check if account is suspended
  ↓
Generate JWT token
  ↓
Return user + token
  ↓
Frontend stores token in localStorage
  ↓
User logged in
```

### 3. Protected Route Access Flow

```
User requests protected route
  ↓
Frontend checks localStorage for token
  ↓
Token exists? → Add to Authorization header
  ↓
Backend receives request
  ↓
protect middleware extracts token
  ↓
Verify JWT token
  ↓
Token valid? → Get user from database
  ↓
User exists? → Attach to req.user
  ↓
Continue to route handler
  ↓
Token invalid? → Return 401 Unauthorized
  ↓
Frontend redirects to login
```

### 4. Password Reset Flow

```
User → Forgot Password → POST /api/auth/forgot-password
  ↓
Backend finds user by email
  ↓
Generate reset token
  ↓
Save token to database (expires in 1 hour)
  ↓
Send reset email with token link
  ↓
User clicks link → /reset-password/:token
  ↓
User submits new password → POST /api/auth/reset-password
  ↓
Backend validates token
  ↓
Token valid and not expired? → Update password
  ↓
Delete token from database
  ↓
Return success
  ↓
User can login with new password
```

### 5. Email Verification Flow

```
User signs up
  ↓
Backend generates verification token
  ↓
Sends email with verification link
  ↓
User clicks link → /verify-email/:token
  ↓
Frontend calls GET /api/auth/verify-email/:token
  ↓
Backend validates token
  ↓
Token valid? → Mark email as verified
  ↓
Delete token from database
  ↓
Return success
```

### 6. Logout Flow

```
User clicks logout
  ↓
Frontend calls POST /api/auth/logout
  ↓
Backend validates token (optional)
  ↓
Frontend removes token from localStorage
  ↓
Clear user state
  ↓
Redirect to home/login
```

## 🔑 Token Management

### JWT Token Structure

```json
{
  "id": "user_id",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### Token Storage

- **Frontend**: `localStorage` as `adoptnest_user`
- **Format**: JSON string with user data and token
- **Expiration**: 7 days (configurable)

### Token Usage

```javascript
// Request interceptor adds token
config.headers.Authorization = `Bearer ${token}`;
```

## 🛡️ Middleware Flow

### protect Middleware

```javascript
1. Extract token from Authorization header
2. Verify token with JWT_SECRET
3. Get user from database
4. Attach user to req.user
5. Continue to next middleware/route
```

### authorize Middleware

```javascript
1. Check req.user.role
2. Compare with allowed roles
3. Allow if role matches
4. Return 403 if not authorized
```

## 🔄 Session Management

### Token Refresh

Currently, tokens don't auto-refresh. User must login again after expiration.

### Token Expiration Handling

```javascript
// Frontend interceptor
if (error.status === 401) {
  localStorage.removeItem('adoptnest_user');
  window.location.href = '/login';
}
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **Token Expiration**: Configurable expiration time
3. **HTTPS**: Required in production
4. **Token Storage**: localStorage (consider httpOnly cookies for production)
5. **Rate Limiting**: Prevents brute force attacks

## 📝 Default Credentials (After Seeding)

### Admin Accounts
1. **Email**: `Jashkaranjoshi@gmail.com`
   - **Password**: `123456`

2. **Email**: `Admin@gmail.com`
   - **Password**: `admin@123`

### Regular Users (After Seeding)
- **Email**: Any from seeded users (generated with Indian names)
- **Password**: `user@123` (for all 25 users)

**Note**: These credentials are created by the seed script. See [Seed Data Documentation](../seed-data/test-credentials.md) for details.

---

**Next**: See [Authentication Logic](./logic.md).

