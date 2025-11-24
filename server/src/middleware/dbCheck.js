/**
 * Database Connection Check Middleware
 * Ensures database is connected before processing requests
 */
const { getConnectionStatus } = require('../config/database');

const dbCheck = (req, res, next) => {
  const dbStatus = getConnectionStatus();
  
  // Allow health check endpoint to work even if DB is down
  if (req.path === '/api/health' || req.path === '/health') {
    return next();
  }
  
  // Check if database is connected
  if (!dbStatus.isConnected) {
    // Set CORS headers even on database errors
    const config = require('../config');
    const allowedOrigins = Array.isArray(config.frontend.url) 
      ? config.frontend.url 
      : [config.frontend.url];
    
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable. Please try again later.',
      code: 'DATABASE_UNAVAILABLE',
      database: {
        status: 'disconnected',
        readyState: dbStatus.readyState
      }
    });
  }
  
  next();
};

module.exports = dbCheck;

