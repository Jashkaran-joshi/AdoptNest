# Authentication Middleware

## 🛡️ Auth Middleware

**Location**: `server/src/middleware/auth.js`

## 📋 Middleware Functions

### protect Middleware

**Purpose**: Verify JWT token and authenticate user

**Flow**:
```
Request with Authorization header
  ↓
Extract token from "Bearer <token>"
  ↓
Token exists? → Verify with JWT_SECRET
  ↓
Token valid? → Get user from database
  ↓
User exists? → Attach to req.user
  ↓
Continue to next middleware
  ↓
Token invalid/missing? → Return 401
```

**Usage**:
```javascript
router.get('/dashboard', protect, getDashboard);
```

### authorize Middleware

**Purpose**: Check user role for authorization

**Flow**:
```
Request with req.user
  ↓
Check req.user.role
  ↓
Role in allowed roles? → Continue
  ↓
Role not allowed? → Return 403
```

**Usage**:
```javascript
router.post('/pets', protect, authorize('admin'), createPet);
```

## 🔄 Middleware Chain

### Example: Admin Route
```javascript
router.post('/pets',
  protect,              // 1. Verify authentication
  authorize('admin'),   // 2. Verify admin role
  upload.single('image'), // 3. Handle file upload
  validate(petSchema),   // 4. Validate data
  createPet             // 5. Controller
);
```

## 🚨 Error Responses

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Not authorized to access this route",
  "code": "UNAUTHORIZED"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "User role 'user' is not authorized",
  "code": "FORBIDDEN"
}
```

---

**Next**: See [Authentication Flows](./flows.md).

