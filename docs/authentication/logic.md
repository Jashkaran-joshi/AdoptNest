# Authentication Logic

## 🔐 Authentication System

The application uses **JWT (JSON Web Tokens)** for stateless authentication.

## 🔑 JWT Token Generation

### Token Creation
**Location**: `server/src/models/User.js`

```javascript
UserSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id },
    config.jwt.secret,
    { expiresIn: config.jwt.expire }
  );
};
```

### Token Payload
```javascript
{
  id: "user_id",
  iat: 1234567890,  // Issued at
  exp: 1234567890   // Expiration
}
```

## 🔒 Password Security

### Password Hashing
**Location**: `server/src/models/User.js`

```javascript
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

### Password Verification
```javascript
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

## 🛡️ Authentication Middleware

### protect Middleware
**Location**: `server/src/middleware/auth.js`

**Flow**:
1. Extract token from `Authorization` header
2. Verify token with JWT_SECRET
3. Get user from database
4. Attach user to `req.user`
5. Continue to next middleware

### authorize Middleware
**Flow**:
1. Check `req.user.role`
2. Compare with allowed roles
3. Allow or deny access

## 🔄 Token Storage

### Frontend Storage
- **Location**: `localStorage`
- **Key**: `adoptnest_user`
- **Format**: JSON string with user data and token

### Token Usage
```javascript
// Request interceptor adds token
config.headers.Authorization = `Bearer ${token}`;
```

## ⏰ Token Expiration

### Default Expiration
- **Duration**: 7 days
- **Configurable**: Via `JWT_EXPIRE` in `.env`

### Expiration Handling
```javascript
// Frontend interceptor
if (error.status === 401) {
  localStorage.removeItem('adoptnest_user');
  window.location.href = '/login';
}
```

## 🔐 Role-Based Access

### Roles
- **user**: Regular user
- **admin**: Administrator

### Role Check
```javascript
if (req.user.role !== 'admin') {
  return res.status(403).json({ message: 'Forbidden' });
}
```

## 🔑 Default Credentials (After Seeding)

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

**Next**: See [Authentication Flows](./flows.md).

