const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { getConnectionStatus } = require('./config/database');

// Import routes
const routes = require('./routes');

const app = express();

// Trust proxy - Required for express-rate-limit to work correctly behind reverse proxies (Render, Vercel, etc.)
// This allows Express to trust the X-Forwarded-For header from proxies
app.set('trust proxy', true);

// CORS configuration (MUST be first middleware)
// Support multiple origins (array) or single origin (string)
// Only allow https://adoptnest.vercel.app and local development
const getAllowedOrigins = () => {
  const origins = Array.isArray(config.frontend.url) 
    ? config.frontend.url 
    : [config.frontend.url];
  
  // Always include localhost for development
  const allowed = [...origins];
  if (!allowed.includes('http://localhost:5173') && !allowed.includes('http://localhost:3000')) {
    allowed.push('http://localhost:5173');
  }
  
  // Log CORS configuration on startup
  console.log('🌐 CORS configured for origins:', allowed);
  console.log('🌐 CORS will automatically allow all *.vercel.app domains (preview deployments)');
  
  // Explicitly log if production frontend URL is configured
  const prodUrl = allowed.find(url => url.includes('adoptnest.vercel.app'));
  if (prodUrl) {
    console.log(`✅ Production frontend URL configured: ${prodUrl}`);
  } else {
    console.log('⚠️  Production frontend URL (https://adoptnest.vercel.app) not explicitly configured');
    console.log('   It will be allowed via *.vercel.app wildcard, but consider adding it explicitly');
  }
  
  return allowed;
};

// Check if origin is a Vercel preview domain
const isVercelPreviewDomain = (origin) => {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    // Allow all Vercel preview domains (*.vercel.app)
    return url.hostname.endsWith('.vercel.app');
  } catch (e) {
    return false;
  }
};

const allowedOrigins = getAllowedOrigins();

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, curl, etc.)
    // This is important for server-to-server requests
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if the origin is in the allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }
    
    // Automatically allow all Vercel preview domains (*.vercel.app)
    if (isVercelPreviewDomain(origin)) {
      console.log(`✅ CORS allowed Vercel preview domain: ${origin}`);
      callback(null, true);
      return;
    }
    
    // Log rejected origins for debugging
    console.warn(`⚠️  CORS blocked origin: ${origin}`);
    console.warn(`   Allowed origins: ${allowedOrigins.join(', ')}, and all *.vercel.app domains`);
    callback(new Error(`Not allowed by CORS. Origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}, and all *.vercel.app domains`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicit OPTIONS handler for preflight requests (backup)
app.options('*', cors(corsOptions));

// Security middleware (configured to allow static file serving and jsDelivr CDN)
// CSP is configured to allow images from jsDelivr CDN and other sources
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",                              // Allow all HTTPS images
        "http:",                               // Allow HTTP images (for development/testing)
        "https://cdn.jsdelivr.net",            // jsDelivr CDN
        "https://raw.githubusercontent.com",   // GitHub raw content
        "https://images.unsplash.com",
        "https://picsum.photos",
        "https://via.placeholder.com"
      ],
      connectSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://raw.githubusercontent.com",
        "http://localhost:5000",
        "http://localhost:5173",
        "*.vercel.app"
      ],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "data:", "https:"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  }
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Serve static files from uploads directory with CORS headers
// This serves files from all category subdirectories (pets, users, stories, blog, etc.)
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }
  next();
}, express.static(path.join(__dirname, '..', config.upload.dir)));

// Database connection check (before routes)
const dbCheck = require('./middleware/dbCheck');
app.use('/api/', dbCheck);

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Root route handler
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AdoptNest API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      api: '/api',
      documentation: 'See API documentation for available endpoints'
    },
    timestamp: new Date().toISOString()
  });
});

// Favicon handler - browsers automatically request this
app.get('/favicon.ico', (req, res) => {
  res.status(204).end(); // 204 No Content - no favicon available
});

// Health check endpoint (public, no auth required)
app.get('/api/health', async (req, res) => {
  try {
    const dbStatus = getConnectionStatus();
    const healthStatus = {
      success: true,
      server: {
        status: 'running',
        environment: config.nodeEnv,
        port: config.port,
        timestamp: new Date().toISOString()
      },
      database: {
        status: dbStatus.isConnected ? 'connected' : 'disconnected',
        isConnected: dbStatus.isConnected,
        readyState: dbStatus.readyState,
        host: dbStatus.host,
        name: dbStatus.name,
        reconnectAttempts: dbStatus.reconnectAttempts
      },
      cors: {
        allowedOrigins: allowedOrigins
      }
    };

    // Return appropriate status code based on database connection
    const statusCode = dbStatus.isConnected ? 200 : 503; // 503 Service Unavailable if DB is down
    
    res.status(statusCode).json(healthStatus);
  } catch (error) {
    // Ensure CORS headers even on health check errors
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    res.status(503).json({
      success: false,
      server: {
        status: 'error',
        message: error.message
      },
      database: {
        status: 'unknown',
        isConnected: false
      },
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
// Register all API routes
app.use('/api', routes);

// Handle requests missing /api prefix (helpful error message)
app.use((req, res, next) => {
  // Check if this looks like an API request but is missing /api prefix
  const apiRoutes = ['/pets', '/auth', '/adoptions', '/surrenders', '/bookings', 
                     '/contact', '/users', '/admin', '/upload', '/stories', 
                     '/volunteers', '/donation-contact', '/blog'];
  
  const isApiRoute = apiRoutes.some(route => req.path.startsWith(route));
  
  if (isApiRoute && !req.path.startsWith('/api')) {
    // Set CORS headers
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
    }
    
    return res.status(404).json({
      success: false,
      message: `Route not found. API routes must include /api prefix. Use /api${req.path} instead of ${req.path}`,
      code: 'ROUTE_NOT_FOUND',
      suggestion: `Try: /api${req.path}`,
      note: 'Ensure VITE_API_BASE environment variable includes /api suffix (e.g., https://adoptnest-render.onrender.com/api)'
    });
  }
  
  next();
});

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;

