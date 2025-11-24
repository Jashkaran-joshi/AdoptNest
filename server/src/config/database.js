const mongoose = require('mongoose');
const config = require('./index');

// Connection state tracking
let isConnected = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 5000; // 5 seconds

// Connection options optimized for cloud MongoDB (Atlas)
// Note: Mongoose 8.x no longer supports bufferMaxEntries, bufferCommands, useNewUrlParser, or useUnifiedTopology
const connectionOptions = {
  // Server Selection and Connection Settings
  serverSelectionTimeoutMS: 30000, // 30 seconds - time to wait for server selection
  socketTimeoutMS: 45000, // 45 seconds - time to wait for socket operations
  connectTimeoutMS: 30000, // 30 seconds - time to wait for initial connection
  
  // Retry and Reconnection Settings
  retryWrites: true, // Enable retryable writes for replica sets
  retryReads: true, // Enable retryable reads
  
  // Pool Settings
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

/**
 * Validate MongoDB URI format - Only MongoDB Atlas (mongodb+srv://) is supported
 */
const validateMongoURI = (uri) => {
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables. Please set it to your MongoDB Atlas connection string.');
  }
  
  // Enforce MongoDB Atlas connection (must use mongodb+srv://)
  if (!uri.startsWith('mongodb+srv://')) {
    throw new Error('MONGODB_URI must be a MongoDB Atlas connection string (mongodb+srv://). Local MongoDB connections are not supported. Please use MongoDB Atlas.');
  }
  
  // Check if it's a valid MongoDB Atlas URI format
  const mongoUriPattern = /^mongodb\+srv:\/\/(?:[^:]+:[^@]+@)?[^/]+(?:\/[^?]+)?(?:\?.*)?$/;
  if (!mongoUriPattern.test(uri)) {
    throw new Error('Invalid MONGODB_URI format. Expected MongoDB Atlas format: mongodb+srv://[username:password@]cluster.mongodb.net[/database][?options]');
  }
  
  return true;
};

/**
 * Set up connection event listeners
 */
const setupConnectionListeners = () => {
  const db = mongoose.connection;

  // Connected event
  db.on('connected', () => {
    isConnected = true;
    reconnectAttempts = 0;
    console.log(`✅ MongoDB connected successfully to: ${db.host}:${db.port}/${db.name}`);
    console.log(`   Connection state: ${db.readyState === 1 ? 'Connected' : 'Disconnected'}`);
  });

  // Error event
  db.on('error', (error) => {
    isConnected = false;
    console.error('❌ MongoDB connection error:', error.message);
    
    // Log specific error types
    if (error.name === 'MongoServerSelectionError') {
      console.error('   ↳ Server selection failed. Check:');
      console.error('      - MongoDB Atlas IP whitelist includes your IP');
      console.error('      - Network connectivity');
      console.error('      - Connection string is correct');
    } else if (error.name === 'MongoNetworkError') {
      console.error('   ↳ Network error. Check:');
      console.error('      - Internet connection');
      console.error('      - MongoDB server is accessible');
      console.error('      - Firewall settings');
    } else if (error.name === 'MongoAuthenticationError') {
      console.error('   ↳ Authentication failed. Check:');
      console.error('      - Username and password in connection string');
      console.error('      - Database user has proper permissions');
    }
  });

  // Disconnected event
  db.on('disconnected', () => {
    isConnected = false;
    console.warn('⚠️  MongoDB disconnected');
    
    // Attempt to reconnect if not explicitly disconnected and not at max attempts
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++;
      console.log(`   Attempting to reconnect... (${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`);
      setTimeout(() => {
        connectDB().catch(err => {
          console.error('   Reconnection failed:', err.message);
        });
      }, RECONNECT_INTERVAL);
    } else {
      console.error(`   Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Please check your MongoDB connection.`);
      console.error('   To retry, restart the server.');
    }
  });

  // Reconnected event
  db.on('reconnected', () => {
    isConnected = true;
    reconnectAttempts = 0;
    console.log(`✅ MongoDB reconnected to: ${db.host}:${db.port}/${db.name}`);
  });

  // Connection timeout event
  db.on('timeout', () => {
    console.warn('⚠️  MongoDB connection timeout');
  });

  // Close event (when connection closes normally)
  db.on('close', () => {
    isConnected = false;
    console.log('📴 MongoDB connection closed');
  });
};

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  try {
    // Validate MongoDB URI
    validateMongoURI(config.database.uri);

    // Set up connection event listeners (only once)
    if (!mongoose.connection.listeners('connected').length) {
      setupConnectionListeners();
    }

    // Close existing connection if any
    if (mongoose.connection.readyState === 1) {
      console.log('   MongoDB already connected');
      return mongoose.connection;
    }

    // Attempt connection
    console.log('🔄 Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(config.database.uri, connectionOptions);
    
    isConnected = true;
    reconnectAttempts = 0;
    
    return conn;
  } catch (error) {
    isConnected = false;
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Verify MONGODB_URI in your .env file (must be MongoDB Atlas connection string)');
      console.error('   2. Ensure your IP is whitelisted in MongoDB Atlas Network Access');
      console.error('   3. Check network connectivity');
      console.error('   4. Verify database credentials in MongoDB Atlas');
      console.error('   5. Ensure your MongoDB Atlas cluster is running (not paused)\n');
    } else if (error.name === 'MongoNetworkError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB server is accessible');
      console.error('   3. Check firewall settings\n');
    } else if (error.name === 'MongoParseError') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   1. Check MONGODB_URI format in your .env file');
      console.error('   2. Ensure connection string is properly escaped\n');
    }
    
    // In production, you might want to retry instead of exiting
    if (config.nodeEnv === 'production') {
      console.log('   Retrying connection in 5 seconds...');
      setTimeout(() => {
        connectDB().catch(() => {
          // If retry fails, exit process
          process.exit(1);
        });
      }, RECONNECT_INTERVAL);
    } else {
      // In development, exit immediately to surface errors quickly
      process.exit(1);
    }
  }
};

/**
 * Get connection status
 */
const getConnectionStatus = () => {
  const db = mongoose.connection;
  return {
    isConnected: isConnected && db.readyState === 1,
    readyState: db.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    host: db.host || 'N/A',
    port: db.port || 'N/A',
    name: db.name || 'N/A',
    reconnectAttempts
  };
};

/**
 * Gracefully close database connection
 */
const closeConnection = async () => {
  try {
    await mongoose.connection.close();
    console.log('📴 MongoDB connection closed gracefully');
    isConnected = false;
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectDB,
  getConnectionStatus,
  closeConnection
};

