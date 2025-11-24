# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
# For local MongoDB, use: mongodb://localhost:27017/adoptnest
# Make sure MongoDB is running locally before starting the server
MONGODB_URI="mongodb+srv://jashkaranjoshi_db_user:mVUx0HtNd3HZBHBg@cluster0.kdoqwhi.mongodb.net/adoptnest_db?retryWrites=true&w=majority&appName=Cluster0"

# JWT Configuration
JWT_SECRET=e4f9b6c8a7db4c39f19ea1d2b3c5f0a8d9e7c4b1a6f2837d4c9a1f6e8b3d7c2f
JWT_EXPIRE=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Admin Account (used for seeding)
ADMIN_EMAIL=admin@adoptnest.com
ADMIN_PASSWORD=admin123

GITHUB_REPO_OWNER=Jashkaran-joshi
GITHUB_REPO_NAME=AdoptNest-jsDelivr
GITHUB_REPO_BRANCH=main

# Email Configuration (Optional - for password reset and email verification)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_FROM=AdoptNest <noreply@adoptnest.com>
