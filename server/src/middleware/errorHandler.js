const errorHandler = (err, req, res, _next) => {
  let error = { ...err };
  error.message = err.message;

  // Ensure CORS headers are always set, even on errors
  const config = require('../config');
  const allowedOrigins = Array.isArray(config.frontend.url) 
    ? config.frontend.url 
    : [config.frontend.url];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Log error with full details (only in development)
  if (config.nodeEnv === 'development') {
    console.error('=== ERROR HANDLER ===');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    console.error('Error Stack:', err.stack);
    console.error('Request URL:', req.originalUrl);
    console.error('Request Method:', req.method);
    console.error('===================');
  } else {
    // In production, log less detail
    console.error(`[${err.name}] ${err.message} - ${req.method} ${req.originalUrl}`);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, code: 'NOT_FOUND', status: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    const message = `${field} already exists`;
    error = { message, code: 'DUPLICATE_ENTRY', status: 409 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, code: 'VALIDATION_ERROR', status: 422, errors: err.errors };
  }

  // Zod validation error
  if (err.name === 'ZodError') {
    const message = 'Validation failed';
    const errors = {};
    err.errors.forEach((error) => {
      errors[error.path.join('.')] = error.message;
    });
    error = { message, code: 'VALIDATION_ERROR', status: 422, errors };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, code: 'TOKEN_INVALID', status: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, code: 'TOKEN_EXPIRED', status: 401 };
  }

  res.status(error.status || 500).json({
    success: false,
    message: error.message || 'Server Error',
    code: error.code || 'SERVER_ERROR',
    ...(error.errors && { errors: error.errors })
  });
};

module.exports = errorHandler;

