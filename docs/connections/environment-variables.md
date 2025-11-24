# Environment Variables

## 📋 Overview

Environment variables configure the application without hardcoding sensitive data.

## 🔧 Backend Environment Variables

### Location
`server/.env`

### Required Variables

#### MONGODB_URI
- **Description**: MongoDB Atlas connection string
- **Format**: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
- **Required**: Yes
- **Example**: 
  ```env
  MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/adoptnest_db?retryWrites=true&w=majority
  ```

#### JWT_SECRET
- **Description**: Secret key for JWT token signing
- **Required**: Yes
- **Example**: 
  ```env
  JWT_SECRET=your-super-secret-jwt-key-change-in-production
  ```

### Optional Variables

#### PORT
- **Description**: Server port
- **Default**: `5000`
- **Example**: 
  ```env
  PORT=5000
  ```

#### NODE_ENV
- **Description**: Environment mode
- **Default**: `development`
- **Options**: `development`, `production`
- **Example**: 
  ```env
  NODE_ENV=development
  ```

#### JWT_EXPIRE
- **Description**: JWT token expiration
- **Default**: `7d`
- **Example**: 
  ```env
  JWT_EXPIRE=7d
  ```

#### FRONTEND_URL
- **Description**: Frontend URL for CORS
- **Default**: `http://localhost:5173`
- **Example**: 
  ```env
  FRONTEND_URL=http://localhost:5173
  ```

#### EMAIL_HOST
- **Description**: SMTP server host
- **Example**: 
  ```env
  EMAIL_HOST=smtp.gmail.com
  ```

#### EMAIL_PORT
- **Description**: SMTP server port
- **Default**: `587`
- **Example**: 
  ```env
  EMAIL_PORT=587
  ```

#### EMAIL_USER
- **Description**: SMTP username
- **Example**: 
  ```env
  EMAIL_USER=your-email@gmail.com
  ```

#### EMAIL_PASS
- **Description**: SMTP password/app password
- **Example**: 
  ```env
  EMAIL_PASS=your-app-password
  ```

#### EMAIL_FROM
- **Description**: Email sender address
- **Default**: `AdoptNest <noreply@adoptnest.com>`
- **Example**: 
  ```env
  EMAIL_FROM=AdoptNest <noreply@adoptnest.com>
  ```

#### UPLOAD_DIR
- **Description**: Directory for file uploads
- **Default**: `uploads`
- **Example**: 
  ```env
  UPLOAD_DIR=uploads
  ```

#### MAX_FILE_SIZE
- **Description**: Maximum file size in bytes
- **Default**: `5242880` (5MB)
- **Example**: 
  ```env
  MAX_FILE_SIZE=5242880
  ```

#### GITHUB_REPO_OWNER
- **Description**: GitHub username/owner for jsDelivr CDN
- **Required**: No (optional, for jsDelivr image URLs)
- **Example**: 
  ```env
  GITHUB_REPO_OWNER=your-username
  ```

#### GITHUB_REPO_NAME
- **Description**: GitHub repository name for jsDelivr CDN
- **Required**: No (optional, for jsDelivr image URLs)
- **Example**: 
  ```env
  GITHUB_REPO_NAME=adoptnest
  ```

#### GITHUB_REPO_BRANCH
- **Description**: GitHub branch for jsDelivr CDN
- **Default**: `main`
- **Example**: 
  ```env
  GITHUB_REPO_BRANCH=main
  ```

#### SEED_VALUE
- **Description**: Seed value for deterministic data generation
- **Required**: No (optional, for reproducible test data)
- **Example**: 
  ```env
  SEED_VALUE=12345
  ```

#### ADMIN_EMAIL
- **Description**: Default admin email
- **Default**: `admin@adoptnest.com`
- **Example**: 
  ```env
  ADMIN_EMAIL=admin@adoptnest.com
  ```

#### ADMIN_PASSWORD
- **Description**: Default admin password
- **Default**: `admin123`
- **Example**: 
  ```env
  ADMIN_PASSWORD=admin123
  ```

## 🎨 Frontend Environment Variables

### Location
`client/.env`

### Required Variables

#### VITE_API_BASE
- **Description**: Backend API base URL
- **Required**: Yes
- **Example**: 
  ```env
  VITE_API_BASE=http://localhost:5000/api
  ```

### Optional Variables

#### VITE_GITHUB_USER
- **Description**: GitHub username for jsDelivr CDN
- **Required**: No (optional, for jsDelivr image URLs)
- **Example**: 
  ```env
  VITE_GITHUB_USER=your-username
  ```

#### VITE_GITHUB_REPO
- **Description**: GitHub repository name for jsDelivr CDN
- **Required**: No (optional, for jsDelivr image URLs)
- **Example**: 
  ```env
  VITE_GITHUB_REPO=adoptnest
  ```

#### VITE_GITHUB_BRANCH
- **Description**: GitHub branch for jsDelivr CDN
- **Default**: `main`
- **Example**: 
  ```env
  VITE_GITHUB_BRANCH=main
  ```

#### VITE_GITHUB_BASE_PATH
- **Description**: Base path in GitHub repository for images
- **Required**: No (optional)
- **Example**: 
  ```env
  VITE_GITHUB_BASE_PATH=images
  ```

### Production Example
```env
VITE_API_BASE=https://api.yourdomain.com/api
VITE_GITHUB_USER=your-username
VITE_GITHUB_REPO=adoptnest
VITE_GITHUB_BRANCH=main
```

## 📝 Complete .env Examples

### Backend `.env`
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database - MongoDB Atlas (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adoptnest_db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=AdoptNest <noreply@adoptnest.com>

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# jsDelivr CDN Configuration (Optional)
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo
GITHUB_REPO_BRANCH=main

# Seed Configuration (Optional)
SEED_VALUE=12345

# Admin Account
ADMIN_EMAIL=admin@adoptnest.com
ADMIN_PASSWORD=admin123
```

### Frontend `.env`
```env
# API Base URL
VITE_API_BASE=http://localhost:5000/api

# jsDelivr CDN Configuration (Optional)
VITE_GITHUB_USER=your-username
VITE_GITHUB_REPO=your-repo
VITE_GITHUB_BRANCH=main
VITE_GITHUB_BASE_PATH=images
```

## 🔒 Security Notes

1. **Never commit** `.env` files to version control
2. **Use strong secrets** for JWT_SECRET
3. **Change defaults** in production
4. **Use environment-specific** values
5. **Rotate secrets** regularly

## 🚀 Loading Environment Variables

### Backend
Uses `dotenv` package:
```javascript
require('dotenv').config();
```

### Frontend
Vite automatically loads `.env` files:
- `.env` - All environments
- `.env.local` - Local overrides
- `.env.production` - Production only

## 📋 Environment Variable Access

### Backend
```javascript
process.env.MONGODB_URI
process.env.JWT_SECRET
```

### Frontend
```javascript
import.meta.env.VITE_API_BASE
```

**Note**: Frontend variables must be prefixed with `VITE_` to be exposed.

---

**Next**: See [Frontend-Backend Connection](./frontend-backend.md).

