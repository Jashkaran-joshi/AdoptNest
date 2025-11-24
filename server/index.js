const app = require('./src/app');
const { connectDB, closeConnection } = require('./src/config/database');
const config = require('./src/config');

// Initialize server
let server;

/**
 * Start server after database connection is established
 */
const startServer = async () => {
  try {
    // Connect to database first
    console.log('🚀 Starting AdoptNest server...\n');
    await connectDB();
    
    // Database connection successful, start server
    // Use process.env.PORT for Render/Heroku, fallback to config.port
    const PORT = process.env.PORT || config.port;
    
    server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n✅ Server running in ${config.nodeEnv} mode on port ${PORT}`);
      console.log(`   API URL: http://localhost:${PORT}/api`);
      console.log(`   Health Check: http://localhost:${PORT}/api/health\n`);
    });

    // Handle server errors
    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
      } else {
        console.error('❌ Server error:', error.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Promise Rejection: ${err.message}`);
  console.error(err.stack);
  // Close server & exit process
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Handle SIGTERM (graceful shutdown)
process.on('SIGTERM', async () => {
  console.log('\n⚠️  SIGTERM received. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('✅ Server closed');
      await closeConnection();
      console.log('✅ Process terminated gracefully');
      process.exit(0);
    });
  } else {
    await closeConnection();
    process.exit(0);
  }
});

// Handle SIGINT (Ctrl+C)
process.on('SIGINT', async () => {
  console.log('\n⚠️  SIGINT received. Shutting down gracefully...');
  if (server) {
    server.close(async () => {
      console.log('✅ Server closed');
      await closeConnection();
      console.log('✅ Process terminated gracefully');
      process.exit(0);
    });
  } else {
    await closeConnection();
    process.exit(0);
  }
});

// Start the server
startServer();

