# AdoptNest Client

**React frontend** for the pet adoption platform.

## Stack

- **React 19** — UI framework with compiler optimizations
- **Vite 7** — Fast build tool and dev server
- **React Router 7** — Client-side routing
- **Tailwind CSS 4** — Utility-first styling
- **Axios** — HTTP client for API calls

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Variables

Create `client/.env`:

```env
VITE_API_BASE=http://localhost:5000/api
VITE_GITHUB_USER=your-username      # Optional: for jsDelivr images
VITE_GITHUB_REPO=your-repo          # Optional: for jsDelivr images
VITE_GITHUB_BRANCH=main             # Optional: for jsDelivr images
```

Required: `VITE_API_BASE`

## Development Tasks

**Preview seeded data:**
```bash
# Ensure backend is running and seeded
npm run dev
# Navigate to http://localhost:5173/adopt
```

**UI Assets:**
- Screenshots: See `/docs/` for UI references
- Reference image: `/mnt/data/7604703f-6711-4bc6-8e22-7358a54cbc3b.png`

## UI Testing Checklist

- ✅ Responsive layout (320px → 1920px)
- ✅ Images load with fallbacks
- ✅ Pagination scrolls to top
- ✅ Dark mode toggle works
- ✅ Navigation links work
- ✅ Forms validate correctly

## Project Structure

```
src/
├── pages/          # Route components
├── components/     # Reusable components
├── services/       # API client
├── contexts/       # React contexts
└── utils/          # Helpers & utilities
```

---

**✅ Verification**: Run `npm run dev` and open `http://localhost:5173`
