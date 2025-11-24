# AdoptNest Server

**Express.js REST API** backend for the pet adoption platform.

## Stack

- **Express 4** — Web framework
- **MongoDB Atlas** — Cloud database via Mongoose
- **JWT** — Authentication tokens
- **Zod** — Schema validation
- **Helmet** — Security headers
- **Multer** — File upload handling

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start with nodemon (auto-reload)
npm start            # Start production server
npm run seed:dev     # Seed development database
npm test             # Run Jest tests
npm run lint         # Run ESLint
```

## Database & Seeding

**Connection:**
- Uses MongoDB Atlas (configured via `MONGODB_URI`)
- Auto-connects on server start

**Seed Development Data:**
```bash
npm run seed:dev
```

**Deterministic Seeding:**
Set `SEED_VALUE` in `.env` for reproducible data:
```env
SEED_VALUE=12345  # Same seed = same data
```

## Environment Variables

Create `server/.env`:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
GITHUB_REPO_OWNER=username      # Optional: for jsDelivr images
GITHUB_REPO_NAME=repo-name     # Optional: for jsDelivr images
SEED_VALUE=                     # Optional: for deterministic seeds
```

Required: `MONGODB_URI`, `JWT_SECRET`

## API

**Base Path:** `/api`

**Health Check:**
```bash
curl http://localhost:5000/api/health
```

**Example Endpoints:**
- `GET /api/pets` — List pets
- `GET /api/blog` — List blog posts
- `GET /api/stories` — List success stories

## CORS & Origins

**Allowed Origins:**
- `FRONTEND_URL` from environment
- All `*.vercel.app` domains (preview deployments)
- `localhost:5173` and `localhost:3000` (development)

Configured in `src/app.js` with automatic Vercel preview support.

## File Storage

**Image Hosting:**
- **Primary**: jsDelivr CDN (GitHub-hosted images)
- **Fallback**: Placeholder URLs
- **Local**: `/uploads/` directory (backward compatibility)

Configure GitHub repo in `.env` for jsDelivr CDN URLs.

---

**✅ Verification**: Run `npm run dev` and check `http://localhost:5000/api/health`

