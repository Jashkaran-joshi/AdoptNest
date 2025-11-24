# Running the Project

## 🚀 Quick Start

### Development Mode

#### Backend
```bash
cd server
npm install
npm start
```
- Runs on `http://localhost:5000`
- Auto-reload with nodemon in dev mode

#### Frontend
```bash
cd client
npm install
npm run dev
```
- Runs on `http://localhost:5173`
- Hot module replacement enabled

### Production Mode

#### Backend
```bash
cd server
npm install
npm start
```
- Set `NODE_ENV=production` in `.env`

#### Frontend
```bash
cd client
npm install
npm run build
npm run preview
```
- Build creates optimized `dist/` folder
- Preview serves production build

## 📋 Complete Setup Steps

### 1. Install Dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2. Configure Environment

#### Backend `.env`
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
PORT=5000
NODE_ENV=development
```

#### Frontend `.env`
```env
VITE_API_BASE=http://localhost:5000/api
```

### 3. Start Services

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 4. Access Application
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`
- Health Check: `http://localhost:5000/api/health`

## 🔧 Development Commands

### Backend Commands
```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm test           # Run tests
npm run lint       # Lint code
npm run lint:fix   # Fix linting issues
```

### Frontend Commands
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>    # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Connection Issues
```bash
# Test connection
cd server
npm run test:db
```

### Clear Cache
```bash
# Backend
rm -rf node_modules
npm install

# Frontend
rm -rf node_modules .vite
npm install
```

---

**Next**: See [Seeding Commands](./seeding.md).

