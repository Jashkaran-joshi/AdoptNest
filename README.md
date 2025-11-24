# AdoptNest 🐾

**A full-stack pet adoption platform** connecting rescued pets with loving families.

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │─────▶│    Render    │─────▶│ MongoDB     │
│  (Frontend) │      │   (Backend) │      │   Atlas     │
│  React+Vite │      │  Express.js │      │  Database   │
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │
       └────────────────────┘
              │
       ┌──────▼──────┐
       │  jsDelivr   │
       │  (Images)   │
       └─────────────┘
```

## Quick Start

```bash
# Install dependencies
npm install --prefix client && npm install --prefix server

# Run development servers
npm run dev --prefix server    # Backend on :5000
npm run dev --prefix client    # Frontend on :5173

# Build for production
npm run build --prefix client
```

## Documentation

- **Client**: See [`client/README.md`](./client/README.md) for frontend details
- **Server**: See [`server/README.md`](./server/README.md) for backend details
- **Full Docs**: See [`docs/`](./docs/) for comprehensive documentation

## Environment Setup

Copy `.env.example` files and configure:

- **Client**: `client/.env.example` → `client/.env`
- **Server**: `server/.env.example` → `server/.env`

Required variables:
- `MONGODB_URI` (server)
- `VITE_API_BASE` (client)
- `JWT_SECRET` (server)

## Deployment

- **Frontend**: Vercel (auto-deploys on push)
- **Backend**: Render (see `server/Procfile`)

Preview deployments automatically get CORS access via `*.vercel.app` wildcard.

## What to Check First

- ✅ Backend running on `http://localhost:5000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ MongoDB connection string in `server/.env`

## Troubleshooting

Check environment variables and ensure MongoDB Atlas connection is active. See deployment docs in `docs/deployment/`.

---

**✅ Verification**: Run `npm run dev` in both `client/` and `server/`, then open `http://localhost:5173`

