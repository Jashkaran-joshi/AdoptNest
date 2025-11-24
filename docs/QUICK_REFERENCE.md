# Quick Reference Guide

## 🚀 Quick Start Commands

### Setup
```bash
# Backend
cd server
npm install
npm run setup:atlas  # Configure MongoDB Atlas

# Frontend
cd client
npm install
```

### Run Development
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm run dev
```

### Seed Database
```bash
cd server
npm run seed:dev
```

## 🔐 Default Credentials

### Admin (After Seeding)
1. **Email**: `Jashkaranjoshi@gmail.com`
   **Password**: `123456`
2. **Email**: `Admin@gmail.com`
   **Password**: `admin@123`

### Regular Users (After Seeding)
- **Email**: Any from seeded users (generated with Indian names)
- **Password**: `user@123` (for all 25 users)

## 🌐 URLs

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000/api`
- **Health Check**: `http://localhost:5000/api/health`

## 📋 Common Commands

### Backend
```bash
npm start          # Start server
npm run dev        # Dev with auto-reload
npm run seed:dev   # Seed test data
npm run test:db    # Test database connection
npm test           # Run tests
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔗 Key Files

### Configuration
- **Backend .env**: `server/.env`
- **Frontend .env**: `client/.env`
- **Database Config**: `server/src/config/database.js`

### Entry Points
- **Backend**: `server/index.js`
- **Frontend**: `client/src/main.jsx`

### Routes
- **Backend**: `server/src/routes/index.js`
- **Frontend**: `client/src/App.jsx`

## 📚 Documentation Structure

```
docs/
├── README.md                    # Main index
├── frontend/                     # Frontend docs
├── backend/                      # Backend docs
├── database/                     # Database docs
├── connections/                  # Connection docs
├── code-flow/                    # Code flow docs
├── commands/                     # Command docs
├── seed-data/                    # Seeding docs
├── authentication/               # Auth docs
└── features/                     # Feature docs
```

## 🆘 Troubleshooting

### Database Connection
```bash
cd server
npm run test:db
```

### Port Issues
```bash
# Find process
lsof -i :5000    # Mac/Linux
netstat -ano | findstr :5000  # Windows
```

### Clear Cache
```bash
# Backend
rm -rf node_modules && npm install

# Frontend
rm -rf node_modules .vite && npm install
```

---

**For detailed information, see the main [Documentation Index](./README.md)**

