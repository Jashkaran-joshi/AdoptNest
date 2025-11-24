# Error Handling

## 🚨 Error Handling System

Centralized error handling in `server/src/middleware/errorHandler.js`.

## 📋 Error Types Handled

### Mongoose Errors

#### CastError
- **When**: Invalid ObjectId
- **Response**: 404 Not Found

#### ValidationError
- **When**: Schema validation fails
- **Response**: 422 Validation Error
- **Includes**: Field-specific errors

#### Duplicate Key (11000)
- **When**: Unique constraint violation
- **Response**: 409 Conflict

### JWT Errors

#### JsonWebTokenError
- **When**: Invalid token
- **Response**: 401 Unauthorized

#### TokenExpiredError
- **When**: Token expired
- **Response**: 401 Unauthorized

### Zod Validation Errors
- **When**: Request validation fails
- **Response**: 422 Validation Error
- **Includes**: Field-specific errors

### Custom Errors
- **When**: Application throws custom errors
- **Response**: Based on error status/code

## 🔄 Error Flow

```
Error occurs
  ↓
Controller calls next(error)
  ↓
Error handler middleware
  ↓
Identify error type
  ↓
Format error response
  ↓
Log error details
  ↓
Send response
```

## 📊 Error Response Format

### Standard Error
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": "Invalid email format",
    "password": "Password too short"
  }
}
```

## 🔍 Error Logging

Errors are logged with:
- Error name
- Error message
- Stack trace
- Request URL
- Request method

---

**Next**: Return to [Main Documentation](../README.md).

