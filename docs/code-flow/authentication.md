# Authentication Code Flow

## 🔐 Complete Authentication Flow

### 1. User Registration

```
User fills signup form
  ↓
Frontend: POST /api/auth/signup
  Body: { name, email, password, phone, city }
  ↓
Backend: validate(signupSchema)
  ↓
Backend: authController.signup()
  ↓
Backend: authService.signup(userData)
  ↓
  Check if user exists
  ↓
  Create user (password hashed by pre-save hook)
  ↓
  Generate email verification token
  ↓
  Save token to database
  ↓
  Send verification email (production)
  ↓
  Generate JWT token
  ↓
Return: { user, token }
  ↓
Frontend: Store in localStorage
  ↓
User logged in
```

### 2. User Login

```
User fills login form
  ↓
Frontend: POST /api/auth/login
  Body: { email, password }
  ↓
Backend: validate(loginSchema)
  ↓
Backend: authController.login()
  ↓
Backend: authService.login(email, password)
  ↓
  Find user by email (with password)
  ↓
  Check if suspended
  ↓
  Compare passwords (bcrypt)
  ↓
  Generate JWT token
  ↓
Return: { user, token }
  ↓
Frontend: Store in localStorage
  ↓
User logged in
```

### 3. Protected Route Access

```
User requests protected route
  ↓
Frontend: API request with token
  Headers: Authorization: Bearer <token>
  ↓
Backend: protect middleware
  ↓
  Extract token from header
  ↓
  Verify token (jwt.verify)
  ↓
  Get user from database
  ↓
  Attach to req.user
  ↓
Continue to route handler
  ↓
Controller processes request
  ↓
Return response
```

### 4. Password Reset

```
User requests password reset
  ↓
Frontend: POST /api/auth/forgot-password
  Body: { email }
  ↓
Backend: authService.forgotPassword(email)
  ↓
  Find user by email
  ↓
  Generate reset token
  ↓
  Save token to database (expires in 1 hour)
  ↓
  Send reset email
  ↓
Return: Success message
  ↓
User clicks email link
  ↓
Frontend: /reset-password/:token
  ↓
User submits new password
  ↓
Frontend: POST /api/auth/reset-password
  Body: { token, password }
  ↓
Backend: authService.resetPassword(token, password)
  ↓
  Find token in database
  ↓
  Check if expired
  ↓
  Update user password (hashed)
  ↓
  Delete token
  ↓
Return: Success
```

---

**Next**: See [Adoption Flow](./adoption.md).

