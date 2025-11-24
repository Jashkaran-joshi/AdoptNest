# Building Commands

## 🏗️ Frontend Build

### Development Build
```bash
cd client
npm run dev
```
- Development server with HMR
- No build files generated

### Production Build
```bash
cd client
npm run build
```
- Creates optimized `dist/` folder
- Minified and optimized code
- Tree-shaking enabled

### Preview Production Build
```bash
cd client
npm run build
npm run preview
```
- Serves production build locally
- Tests production build

## 🚀 Backend Build

### No Build Required
Node.js backend doesn't require building:
```bash
cd server
npm start
```

### Production Deployment
1. Set `NODE_ENV=production` in `.env`
2. Start server: `npm start`
3. Use process manager (PM2) for production

## 📦 Build Output

### Frontend
- **Location**: `client/dist/`
- **Contents**: 
  - `index.html`
  - `assets/` (JS, CSS)
  - Static files

### Backend
- No build output
- Run directly with Node.js

## 🔧 Build Configuration

### Frontend (Vite)
- Config: `client/vite.config.js`
- Optimizations: Automatic
- Output: `dist/` directory

### Environment Variables
- Development: `.env`
- Production: `.env.production`

---

**Next**: See [Testing Commands](./testing.md).

