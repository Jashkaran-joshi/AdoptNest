const config = require('../config');

const notFound = (req, res, next) => {
  // Ensure CORS headers are set for 404 responses
  const allowedOrigins = Array.isArray(config.frontend.url) 
    ? config.frontend.url 
    : [config.frontend.url];
  
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  // Don't log 404s for favicon or common browser requests
  if (!req.originalUrl.includes('favicon.ico') && !req.originalUrl.includes('robots.txt')) {
    console.warn(`⚠️  404 Not Found: ${req.method} ${req.originalUrl}`);
  }

  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = notFound;

