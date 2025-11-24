# Frontend Commands

## 🚀 Development Commands

### Start Development Server
```bash
cd client
npm run dev
```
- Starts Vite dev server
- Hot module replacement enabled
- Usually runs on `http://localhost:5173`
- Auto-reloads on file changes

### Build for Production
```bash
cd client
npm run build
```
- Creates optimized production build
- Outputs to `dist/` directory
- Minifies and optimizes code
- Tree-shaking enabled

### Preview Production Build
```bash
cd client
npm run preview
```
- Serves production build locally
- Tests production build before deployment
- Runs on default port

## 🔍 Code Quality Commands

### Lint Code
```bash
cd client
npm run lint
```
- Checks code for errors and warnings
- Uses ESLint configuration
- Reports issues in console

### Fix Linting Issues
```bash
cd client
npm run lint -- --fix
```
- Automatically fixes fixable linting issues
- Formats code according to rules

## 📦 Package Management

### Install Dependencies
```bash
cd client
npm install
```
- Installs all dependencies from `package.json`
- Creates `node_modules/` directory

### Add New Dependency
```bash
cd client
npm install package-name
```

### Add Dev Dependency
```bash
cd client
npm install -D package-name
```

### Update Dependencies
```bash
cd client
npm update
```

## 🎯 Common Workflows

### Starting Development
```bash
# Terminal 1: Start backend
cd server
npm start

# Terminal 2: Start frontend
cd client
npm run dev
```

### Building for Production
```bash
cd client
npm run build
# Output in dist/ directory
```

### Testing Production Build
```bash
cd client
npm run build
npm run preview
```

## 🔧 Environment Variables

### Development
Create `client/.env`:
```env
VITE_API_BASE=http://localhost:5000/api
```

### Production
Update `VITE_API_BASE` to production API URL.

## 📝 Script Reference

All scripts are defined in `client/package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  }
}
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill
```

### Clear Cache
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build
```

---

**Next**: See [Backend Documentation](../backend/) for backend commands.

