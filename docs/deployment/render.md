# Render Deployment Guide

## 🚀 Deploying to Render

### Issue Fixed

The error `Cannot find module '/opt/render/project/src/server.js'` occurred because:
- `package.json` had `"main": "server.js"` but the actual file is `index.js`
- Render was using the `main` field to find the entry point

**Fixed**: Updated `package.json` to point to `index.js`

## 📋 Deployment Configuration

### Files Created

1. **render.yaml** - Render service configuration
2. **server/Procfile** - Process file for Render

### Configuration Details

#### render.yaml
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Entry Point**: `server/index.js`

#### Procfile
- **Command**: `web: node index.js`

## 🔧 Render Setup Steps

### 1. Create Web Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your repository

### 2. Configure Service

**Settings**:
- **Name**: `adoptnest-backend`
- **Environment**: `Node`
- **Root Directory**: `server` (important!)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 3. Environment Variables

Add these in Render dashboard:

**Required**:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Set to `production`

**Optional**:
- `PORT` - Port (Render sets this automatically)
- `FRONTEND_URL` - Your frontend URL (comma-separated for multiple domains)
- `GITHUB_REPO_OWNER` - GitHub username for jsDelivr CDN
- `GITHUB_REPO_NAME` - GitHub repository name for jsDelivr CDN
- `GITHUB_REPO_BRANCH` - GitHub branch for jsDelivr CDN (default: `main`)
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS` - Email config
- `SEED_VALUE` - Seed value for deterministic data generation

### 4. Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Install dependencies
   - Run build command
   - Start the service
   - Provide a URL

## ✅ Verification

After deployment, check:
- Service is running (green status)
- Logs show "MongoDB connected successfully"
- Health endpoint works: `https://your-service.onrender.com/api/health`

## 🐛 Troubleshooting

### Error: Cannot find module
- **Solution**: Ensure Root Directory is set to `server`
- **Check**: `package.json` main field points to `index.js`

### Database Connection Error
- **Solution**: Verify `MONGODB_URI` is set correctly
- **Check**: IP whitelist includes Render's IPs (or use `0.0.0.0/0`)

### Port Issues
- **Solution**: Render sets PORT automatically, don't hardcode it
- **Check**: Use `process.env.PORT || 5000` in code

---

**Next**: See [Deployment Documentation](../README.md).

