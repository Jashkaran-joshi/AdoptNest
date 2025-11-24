require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    uri: (() => {
      const uri = process.env.MONGODB_URI;
      if (!uri) {
        console.error('\n❌ MONGODB_URI is not set in your .env file');
        console.error('\n📝 Quick Fix:');
        console.error('   1. Manually add MONGODB_URI to server/.env file');
        console.error('   2. Format: mongodb+srv://username:password@cluster.mongodb.net/database');
        console.error('   3. Get connection string from MongoDB Atlas dashboard\n');
        throw new Error('MONGODB_URI environment variable is required. Please set it to your MongoDB Atlas connection string.');
      }
      // Enforce MongoDB Atlas connection (must use mongodb+srv://)
      if (!uri.startsWith('mongodb+srv://')) {
        console.error('\n❌ MONGODB_URI must be a MongoDB Atlas connection string');
        console.error(`   Current value: ${uri.substring(0, 30)}...`);
        console.error('\n📝 Quick Fix:');
        console.error('   1. Update MONGODB_URI in server/.env to use mongodb+srv:// format');
        console.error('   2. Format: mongodb+srv://username:password@cluster.mongodb.net/database');
        console.error('   3. Get connection string from MongoDB Atlas dashboard\n');
        throw new Error('MONGODB_URI must be a MongoDB Atlas connection string (mongodb+srv://). Local MongoDB connections are not supported.');
      }
      return uri;
    })()
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d'
  },
  
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM || 'AdoptNest <noreply@adoptnest.com>'
  },
  
  frontend: {
    // Support multiple frontend URLs (comma-separated) for CORS
    // Example: FRONTEND_URL=http://localhost:5173,https://adoptnest.vercel.app
    url: (() => {
      const urls = process.env.FRONTEND_URL || 'http://localhost:5173';
      // If comma-separated, return array; otherwise return single string
      return urls.includes(',') ? urls.split(',').map(url => url.trim()) : urls;
    })()
  },
  
  upload: {
    dir: process.env.UPLOAD_DIR || 'uploads',
    maxSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@adoptnest.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  },
  
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
  },
  
  // jsDelivr CDN Configuration (GitHub + jsDelivr)
  jsdelivr: {
    githubOwner: process.env.GITHUB_REPO_OWNER || null,
    githubRepo: process.env.GITHUB_REPO_NAME || null,
    githubBranch: process.env.GITHUB_REPO_BRANCH || 'main',
  },
  
  seed: {
    // Seed value for deterministic random data generation
    // Set SEED_VALUE in .env to generate reproducible test data
    // Can be a number or string - same seed = same data
    value: process.env.SEED_VALUE || null
  }
};
