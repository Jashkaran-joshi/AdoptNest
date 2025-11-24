# JWT Tokens

## 🔑 Token System

The application uses JSON Web Tokens (JWT) for authentication.

## 📋 Token Structure

### Token Payload
```javascript
{
  id: "user_id",        // User MongoDB ID
  iat: 1234567890,      // Issued at timestamp
  exp: 1234567890       // Expiration timestamp
}
```

### Token Format
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🔐 Token Generation

### Creation
**Location**: `server/src/models/User.js`

```javascript
user.getSignedJwtToken()
// Returns JWT token string
```

### Configuration
- **Secret**: `JWT_SECRET` from `.env`
- **Expiration**: `JWT_EXPIRE` from `.env` (default: 7d)
- **Algorithm**: HS256

## 📦 Token Storage

### Frontend
- **Location**: `localStorage`
- **Key**: `adoptnest_user`
- **Format**: JSON string with user data and token

### Usage
```javascript
// Request interceptor adds token
config.headers.Authorization = `Bearer ${token}`;
```

## ⏰ Token Expiration

### Default
- **Duration**: 7 days
- **Configurable**: Via `JWT_EXPIRE` environment variable

### Expiration Handling
```javascript
// Frontend interceptor
if (error.status === 401) {
  // Token expired or invalid
  localStorage.removeItem('adoptnest_user');
  window.location.href = '/login';
}
```

## 🔒 Token Security

### Best Practices
1. **HTTPS**: Use in production
2. **Secret**: Strong, random secret key
3. **Expiration**: Reasonable expiration time
4. **Storage**: Consider httpOnly cookies for production

### Token Validation
```javascript
// Backend middleware
const decoded = jwt.verify(token, config.jwt.secret);
const user = await User.findById(decoded.id);
```

---

**Next**: See [Authentication Middleware](./middleware.md).

