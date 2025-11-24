# Backend Middleware

## 🛡️ Middleware Overview

Middleware functions process requests before they reach route handlers.

## 📋 Available Middleware

### Authentication Middleware
**File**: `middleware/auth.js`

#### protect
- **Purpose**: Verify JWT token
- **Usage**: `protect` on protected routes
- **Flow**:
  1. Extract token from Authorization header
  2. Verify token
  3. Get user from database
  4. Attach to `req.user`
  5. Continue to next middleware

#### authorize
- **Purpose**: Check user role
- **Usage**: `authorize('admin')` after protect
- **Flow**:
  1. Check `req.user.role`
  2. Compare with allowed roles
  3. Allow or deny access

### Error Handler Middleware
**File**: `middleware/errorHandler.js`

- **Purpose**: Centralized error handling
- **Features**:
  - Formats error responses
  - Handles Mongoose errors
  - Handles JWT errors
  - Handles validation errors
  - Logs errors

### Not Found Middleware
**File**: `middleware/notFound.js`

- **Purpose**: Handle 404 errors
- **Usage**: Last middleware before error handler

### Validation Middleware
**File**: `validators/index.js`

- **Purpose**: Validate request data
- **Library**: Zod
- **Usage**: `validate(schema)` before controller

## 🔄 Middleware Order

```
Request
  ↓
CORS
  ↓
Helmet (Security)
  ↓
Body Parser
  ↓
Mongo Sanitize
  ↓
Rate Limiter
  ↓
Routes
  ↓
  Validation
  ↓
  Authentication (protect)
  ↓
  Authorization (authorize)
  ↓
  Controller
  ↓
Not Found (if route not matched)
  ↓
Error Handler
  ↓
Response
```

## 🎯 Middleware Usage Examples

### Protected Route
```javascript
router.get('/dashboard', protect, getDashboard);
```

### Admin Route
```javascript
router.post('/pets', protect, authorize('admin'), createPet);
```

### Validated Route
```javascript
router.post('/auth/signup', validate(signupSchema), signup);
```

---

**Next**: See [Services Documentation](./services.md).

