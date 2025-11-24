# Production Deployment Guide

Complete guide for deploying AdoptNest to production with Vercel (frontend), Render (backend), and jsDelivr CDN (image storage via GitHub).

## 🎯 Overview

This guide ensures seamless integration across all services:
- **Frontend**: Vercel (automatic preview deployments)
- **Backend**: Render (API server)
- **Image Storage**: jsDelivr CDN (GitHub-hosted images)
- **Database**: MongoDB Atlas

## 📋 Prerequisites

1. GitHub repository connected to Vercel and Render
2. GitHub repository for hosting images (can be same or separate repo)
3. MongoDB Atlas account
4. All environment variables configured

---

## 🔧 Step 1: Configure jsDelivr CDN (GitHub-hosted Images)

### 1.1 Prepare GitHub Repository for Images

**Option A: Use Same Repository**
- Images can be stored in your main repository
- Recommended structure: `images/pets/`, `images/stories/`, etc.

**Option B: Use Separate Repository**
- Create a dedicated repository for images
- Easier to manage and organize

### 1.2 Upload Images to GitHub

1. Create directory structure in your repository:
   ```
   images/
     ├── pets/
     ├── stories/
     ├── blog/
     └── surrenders/
   ```

2. Upload images to appropriate directories
3. Commit and push to your repository

### 1.3 Understand jsDelivr URL Format

jsDelivr automatically serves files from GitHub repositories:
```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}
```

**Example**:
```
https://cdn.jsdelivr.net/gh/username/adoptnest@main/images/pets/dog-123.jpg
```

**Benefits**:
- Free CDN with global edge locations
- Automatic caching
- No storage costs
- Fast delivery worldwide

---

## 🔐 Step 2: Environment Variables

### 2.1 Backend Environment Variables (Render)

Go to your Render dashboard → Your Service → Environment → Add Environment Variable:

```env
# Server Configuration
PORT=10000
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adoptnest_db?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Frontend URLs (comma-separated for multiple domains)
FRONTEND_URL=https://your-app.vercel.app,https://your-custom-domain.com

# jsDelivr CDN Configuration (Optional but recommended)
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo-name
GITHUB_REPO_BRANCH=main

# Email (Optional but recommended)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_FROM=AdoptNest <noreply@yourdomain.com>

# Admin Account
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=change-this-secure-password

# Seed Configuration (Optional - for development/testing)
SEED_VALUE=12345
```

**Important Notes:**
- `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are optional but recommended for jsDelivr URLs
- If not configured, system falls back to local storage paths
- `FRONTEND_URL` should include your production Vercel URL
- All `*.vercel.app` domains are automatically allowed (no need to add preview URLs)
- Never commit secrets to version control

### 2.2 Frontend Environment Variables (Vercel)

Go to your Vercel dashboard → Your Project → Settings → Environment Variables:

```env
# API Base URL (your Render backend URL)
VITE_API_BASE=https://your-backend.onrender.com/api

# jsDelivr CDN Configuration (Optional but recommended)
VITE_GITHUB_USER=your-username
VITE_GITHUB_REPO=your-repo-name
VITE_GITHUB_BRANCH=main
VITE_GITHUB_BASE_PATH=images
```

**For All Environments:**
- Add to **Production**
- Add to **Preview** (optional, can use same or different backend)
- Add to **Development** (optional, for local development)

**Delete if present:**
- ❌ `VITE_UPLOADCARE_PUBLIC_KEY`

### 2.3 Vercel Preview Domains

Vercel automatically creates preview URLs like `your-app-abc123.vercel.app` for each deployment.

**Backend CORS is configured to automatically allow all `*.vercel.app` domains**, so no manual configuration needed!

If you have a custom domain, add it to `FRONTEND_URL` in Render environment variables.

---

## 🚀 Step 3: Deploy Backend (Render)

### 3.1 Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure service:

   - **Name**: `adoptnest-backend` (or your choice)
   - **Environment**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Root Directory**: Leave empty (or set to `server` if needed)

### 3.2 Configure Environment Variables

Add all backend environment variables from Step 2.1

### 3.3 Deploy

1. Click **Create Web Service**
2. Wait for first deployment to complete
3. Note your service URL: `https://your-backend.onrender.com`

### 3.4 Verify Backend

1. Check health endpoint: `https://your-backend.onrender.com/api/health`
2. Verify CORS logs in Render logs
3. Test API endpoints with Postman or curl
4. Check logs for any initialization errors

---

## 🎨 Step 4: Deploy Frontend (Vercel)

### 4.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure project:

   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 4.2 Configure Environment Variables

Add all frontend environment variables from Step 2.2

### 4.3 Deploy

1. Click **Deploy**
2. Wait for deployment to complete
3. Note your production URL: `https://your-app.vercel.app`

### 4.4 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update `FRONTEND_URL` in Render with custom domain

---

## ✅ Step 5: Verify Integration

### 5.1 Test Image Display

1. Go to your Vercel app
2. Navigate to pages with images (pets, stories, blog)
3. Verify images display correctly from jsDelivr CDN
4. Check image URL format: `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}`
5. Open browser DevTools → Network tab to verify images load from CDN

### 5.2 Test API Communication

1. Open browser DevTools → Network tab
2. Perform actions that call backend API
3. Verify requests succeed (no CORS errors)
4. Check backend logs in Render

### 5.3 Test Seed Script

1. SSH into Render or use Render Shell
2. Run: `cd server && npm run seed:dev`
3. Verify data is seeded with jsDelivr image URLs
4. Check MongoDB Atlas to confirm data
5. Verify images are accessible via jsDelivr URLs

### 5.4 Test Preview Deployments

1. Create a new branch and push changes
2. Vercel automatically creates preview deployment
3. Verify preview URL works with backend (CORS should auto-allow)
4. No manual configuration needed!

---

## 🔍 Troubleshooting

### Image Display Issues

**Symptom**: Images not displaying on frontend

**Solutions:**
1. Verify `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are set correctly
2. Check image paths in database match GitHub repository structure
3. Verify images exist in GitHub repository
4. Test jsDelivr URL directly in browser: `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}`
5. Check browser console for 404 errors
6. Verify CSP allows `cdn.jsdelivr.net` in `server/src/app.js` (if CSP is configured)

### CORS Errors

**Symptom**: `Access-Control-Allow-Origin` errors in browser console

**Solutions:**
1. Check `FRONTEND_URL` in Render includes your Vercel URL
2. Verify backend CORS logs (should auto-allow `*.vercel.app`)
3. Clear browser cache and retry
4. Check backend logs for CORS warnings

### jsDelivr URL Generation Issues

**Symptom**: Images show placeholder or incorrect URLs

**Solutions:**
1. Verify GitHub repository configuration in environment variables
2. Check image paths in database are correct
3. Ensure GitHub repository is public (jsDelivr requires public repos)
4. Verify branch name matches `GITHUB_REPO_BRANCH`
5. Check backend logs for jsDelivr URL generation errors

### Seed Script Issues

**Symptom**: Seed script fails or generates incorrect data

**Solutions:**
1. Verify `MONGODB_URI` is correct
2. Check `SEED_VALUE` is set if you want deterministic data
3. Verify GitHub repository configuration (for image URLs)
4. Check Render logs for error messages
5. Ensure database name contains "dev" or "test" (or use `FORCE_SEED=true`)

### Preview Deployments Not Working

**Symptom**: Vercel preview URLs blocked by backend CORS

**Solution:** This should be automatically handled! Backend automatically allows all `*.vercel.app` domains. If still having issues:
1. Check backend CORS logs in Render
2. Verify CORS middleware is correctly configured
3. Clear browser cache

---

## 📊 Monitoring

### Backend (Render)

- View logs: Render Dashboard → Your Service → Logs
- Monitor metrics: Render Dashboard → Your Service → Metrics
- Check health: `https://your-backend.onrender.com/api/health`

### Frontend (Vercel)

- View deployments: Vercel Dashboard → Your Project → Deployments
- View analytics: Vercel Dashboard → Your Project → Analytics
- Check build logs: Click on any deployment → View Logs

### jsDelivr CDN

- View repository: GitHub repository
- Monitor usage: jsDelivr provides free CDN service
- Check image availability: Test URLs directly in browser

---

## 🔄 Continuous Deployment

### Automatic Deployments

- **Vercel**: Automatically deploys on every push to main branch
- **Render**: Automatically deploys on every push to main branch
- **Preview Deployments**: Automatically created for pull requests

### Manual Deployments

- **Vercel**: Click "Redeploy" in dashboard
- **Render**: Click "Manual Deploy" in dashboard

### Image Updates

- Upload new images to GitHub repository
- Commit and push changes
- Images are immediately available via jsDelivr CDN
- No redeployment needed!

---

## 🔒 Security Checklist

- [ ] All secrets are in environment variables (never in code)
- [ ] `JWT_SECRET` is strong and unique
- [ ] `ADMIN_PASSWORD` is changed from default
- [ ] `MONGODB_URI` uses strong credentials
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enabled (automatic on Vercel/Render)
- [ ] Database access is restricted (IP whitelist in MongoDB Atlas)
- [ ] GitHub repository is public (required for jsDelivr) or use private repo with authentication
- [ ] Image paths are validated before storing in database

---

## 📝 Environment Variable Summary

### Backend (Render) - Required

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret | `your-secret-key` |
| `FRONTEND_URL` | Frontend URL(s) for CORS | `https://app.vercel.app` |

### Backend (Render) - Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `GITHUB_REPO_OWNER` | GitHub username for jsDelivr | `null` |
| `GITHUB_REPO_NAME` | GitHub repo name for jsDelivr | `null` |
| `GITHUB_REPO_BRANCH` | GitHub branch for jsDelivr | `main` |
| `SEED_VALUE` | Seed value for deterministic data | `null` |
| `PORT` | Server port | `10000` (Render) |
| `NODE_ENV` | Environment | `production` |

### Frontend (Vercel) - Required

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE` | Backend API URL | `https://backend.onrender.com/api` |

### Frontend (Vercel) - Optional

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GITHUB_USER` | GitHub username for jsDelivr | `null` |
| `VITE_GITHUB_REPO` | GitHub repo name for jsDelivr | `null` |
| `VITE_GITHUB_BRANCH` | GitHub branch for jsDelivr | `main` |
| `VITE_GITHUB_BASE_PATH` | Base path in repo for images | `""` |

**Variables to DELETE from Frontend:**
- ❌ `VITE_UPLOADCARE_PUBLIC_KEY`

**Variables to DELETE from Backend:**
- ❌ `UPLOADCARE_PUBLIC_KEY`
- ❌ `UPLOADCARE_SECRET_KEY`
- ❌ `UPLOADCARE_STORE`
- ❌ `FIREBASE_SERVICE_ACCOUNT_KEY`
- ❌ `FIREBASE_STORAGE_BUCKET`

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Frontend loads on Vercel URL
2. ✅ Backend API responds correctly
3. ✅ Images display correctly from jsDelivr CDN
4. ✅ CORS works for all Vercel preview deployments
5. ✅ Seed script generates data with jsDelivr image URLs
6. ✅ All API endpoints work correctly
7. ✅ Authentication works end-to-end
8. ✅ Images load fast from CDN (check Network tab)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [jsDelivr Documentation](https://www.jsdelivr.com/)
- [jsDelivr GitHub CDN](https://www.jsdelivr.com/features#gh)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)

---

## 💡 Tips

### Image Management

1. **Organize by Category**: Keep images organized in GitHub repository
2. **Use Descriptive Names**: Name files descriptively for easier management
3. **Optimize Images**: Compress images before uploading to reduce load times
4. **Version Control**: Use Git to track image changes

### Performance

1. **CDN Caching**: jsDelivr automatically caches images globally
2. **Image Optimization**: Use WebP format when possible
3. **Lazy Loading**: Implement lazy loading for better performance

### Backup

1. **GitHub Repository**: Images are version-controlled in Git
2. **Database Backups**: Regularly backup MongoDB Atlas database
3. **Environment Variables**: Keep secure backups of environment variables

---

**Need Help?** Check the troubleshooting section or review the logs in Render/Vercel dashboards.
