# AdoptNest Client (Frontend)

**Modern React-based frontend for the AdoptNest pet adoption platform**

This is the frontend application for AdoptNest, built with React 19, Vite, and TailwindCSS. It provides a responsive, user-friendly interface for browsing pets, managing adoptions, and interacting with the platform.

---

## 🛠️ Tech Stack

- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Router**: React Router DOM 7.9.6
- **Styling**: TailwindCSS 4.0.0 with PostCSS
- **HTTP Client**: Axios 1.13.2
- **Language**: JavaScript (ES6+)
- **Linting**: ESLint 9.39.1
- **Dev Tools**: Vite Plugin React 5.1.0, React Compiler

---

## 📁 Folder Structure

```
client/
├── public/                      # Static assets
│   ├── favicon.svg              # App favicon
│   └── ...                      # Other static files
│
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── layout/              # Layout components
│   │   │   ├── Navbar.jsx       # Navigation bar
│   │   │   └── Footer.jsx       # Footer
│   │   ├── features/            # Feature-specific components
│   │   │   ├── ProtectedRoute.jsx  # Route authentication wrapper
│   │   │   ├── ScrollToTop.jsx     # Auto-scroll to top on navigation
│   │   │   └── ...
│   │   └── forms/               # Form components and inputs
│   │
│   ├── pages/                   # Page components (route targets)
│   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminAddPet.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   └── AdminViewItem.jsx
│   │   ├── auth/                # Authentication pages
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   └── VerifyEmail.jsx
│   │   ├── content/             # Content pages
│   │   │   ├── Home.jsx         # Landing page
│   │   │   ├── About.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogPost.jsx
│   │   │   └── SuccessStories.jsx
│   │   ├── pets/                # Pet-related pages
│   │   │   ├── Adopt.jsx        # Pet browsing/search
│   │   │   ├── PetDetails.jsx   # Individual pet details
│   │   │   ├── AdoptionForm.jsx # Adoption application form
│   │   │   └── GivePet.jsx      # Pet surrender form
│   │   ├── user/                # User dashboard pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Favorites.jsx
│   │   │   ├── Bookings.jsx
│   │   │   ├── ViewItem.jsx
│   │   │   └── Notifications.jsx
│   │   ├── services/            # Service pages
│   │   │   └── BookService.jsx
│   │   ├── support/             # Support pages
│   │   │   ├── Contact.jsx
│   │   │   ├── Donate.jsx
│   │   │   └── Volunteer.jsx
│   │   ├── legal/               # Legal pages
│   │   │   ├── Privacy.jsx
│   │   │   └── Terms.jsx
│   │   └── common/              # Common pages
│   │       └── NotFound.jsx     # 404 page
│   │
│   ├── contexts/                # React Context API providers
│   │   ├── AuthContext.jsx      # Authentication state
│   │   ├── ThemeContext.jsx     # Theme/dark mode
│   │   └── ...
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication hook
│   │   └── ...
│   │
│   ├── services/                # API service layer
│   │   ├── api.js               # Axios instance configuration
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatters.js        # Data formatting helpers
│   │   ├── validators.js        # Input validation
│   │   └── ...
│   │
│   ├── constants/               # App-wide constants
│   │   └── ...
│   │
│   ├── config/                  # Configuration files
│   │   └── ...
│   │
│   ├── App.jsx                  # Main app component with routes
│   ├── main.jsx                 # React entry point
│   └── index.css                # Global styles & Tailwind directives
│
├── index.html                   # HTML template
├── package.json                 # Dependencies & scripts
├── vite.config.js               # Vite configuration
├── tailwind.config.js           # TailwindCSS configuration
├── postcss.config.js            # PostCSS configuration
├── eslint.config.js             # ESLint configuration
├── .env.example                 # Environment variables template
└── .gitignore                   # Git ignore rules
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18.0.0 or higher
- npm (comes with Node.js)

### Install Dependencies

```bash
cd client
npm install
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the `client/` directory:

```env
# Backend API Base URL
# Development: http://localhost:5000/api
# Production: https://your-backend-domain.com/api
# IMPORTANT: Must include /api at the end
VITE_API_BASE=http://localhost:5000/api

# Optional: Error Reporting (for future use)
# VITE_ENABLE_ERROR_REPORTING=false
```

### Environment Variable Reference

| Variable               | Required | Description                                    | Example                                      |
|------------------------|----------|------------------------------------------------|----------------------------------------------|
| `VITE_API_BASE`        | Yes      | Backend API base URL (must include `/api`)     | `http://localhost:5000/api`                  |
| `VITE_ENABLE_ERROR_REPORTING` | No | Enable error reporting (future feature) | `false`                                      |

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client-side code.

---

## 💻 Running the Application

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The app will be available at **http://localhost:5173**

### Preview Production Build

Build the app and preview it locally:

```bash
npm run build
npm run preview
```

Preview will be available at **http://localhost:4173**

---

## 🏗️ Build for Production

Create an optimized production build:

```bash
npm run build
```

The build output will be in the `dist/` folder, ready for deployment.

**Build output includes**:
- Minified JavaScript bundles
- Optimized CSS
- Compressed assets
- Source maps (for debugging)

---

## 📜 Available Scripts

| Script          | Command              | Description                                          |
|-----------------|----------------------|------------------------------------------------------|
| `dev`           | `vite`               | Start development server on port 5173                |
| `build`         | `vite build`         | Create optimized production build in `dist/`         |
| `preview`       | `vite preview`       | Preview production build locally on port 4173        |
| `lint`          | `eslint .`           | Run ESLint to check code quality                     |

---

## 🎨 Styling & Design System

### TailwindCSS Configuration

The app uses **TailwindCSS 4.0** with a custom design system defined in `tailwind.config.js`:

- **Custom Colors**: Brand colors, semantic colors
- **Custom Fonts**: Typography scale
- **Custom Animations**: Smooth transitions and effects
- **Responsive Breakpoints**: Mobile-first design
- **Dark Mode**: System-based dark mode support

### Global Styles

`src/index.css` contains:
- TailwindCSS directives (`@tailwind base/components/utilities`)
- Custom CSS variables for theming
- Global reset styles
- Custom component classes

---

## 🔐 Authentication Flow

The app uses JWT-based authentication:

1. **Login/Signup**: User credentials sent to `/api/auth/login` or `/api/auth/signup`
2. **Token Storage**: JWT token stored in `localStorage`
3. **Protected Routes**: `ProtectedRoute` component checks authentication
4. **API Requests**: Axios interceptor adds `Authorization: Bearer <token>` header
5. **Auto-Logout**: Token expiration triggers automatic logout

See `src/contexts/AuthContext.jsx` for implementation details.

---

## 🛣️ Routing Structure

The app uses **React Router DOM v7** with the following route structure:

### Public Routes
- `/` - Home page
- `/adopt` - Browse pets
- `/adopt/:id` - Pet details
- `/blog` - Blog listing
- `/blog/:slug` - Individual blog post
- `/success-stories` - Adoption success stories
- `/about` - About page
- `/faq` - Frequently asked questions
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `/login` - User login
- `/signup` - User registration
- `/forgot` - Forgot password
- `/reset-password/:token` - Password reset
- `/verify-email/:token` - Email verification

### Protected Routes (Require Login)
- `/dashboard/*` - User dashboard
- `/favorites` - Saved favorite pets
- `/bookings` - Service bookings
- `/notifications` - User notifications
- `/give` - Pet surrender form
- `/adopt/apply/:id` - Adoption application
- `/volunteer` - Volunteer application
- `/donate` - Donation form
- `/book-service` - Service booking form

### Admin Routes (Require Admin Role)
- `/admin/*` - Admin dashboard
- `/admin/add` - Add new pet
- `/admin/users` - Manage users
- `/admin/view/:type/:id` - View admin items

---

## ⚠️ Common Issues & Fixes

### Issue 1: CORS Errors

**Symptom**: API requests fail with CORS error in browser console

**Fix**:
- Ensure backend server is running on `http://localhost:5000`
- Check `VITE_API_BASE` includes `/api` suffix: `http://localhost:5000/api`
- Verify backend CORS configuration allows `http://localhost:5173`

### Issue 2: Environment Variables Not Loading

**Symptom**: `import.meta.env.VITE_API_BASE` is `undefined`

**Fix**:
- Ensure file is named `.env.local` (not just `.env`)
- All client-side env vars must start with `VITE_`
- Restart dev server after changing env variables
- Check file is in `client/` directory, not project root

### Issue 3: Port Already in Use

**Symptom**: `Port 5173 is already in use`

**Fix**:
```bash
# Option 1: Kill the process using the port
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Option 2: Use a different port
vite --port 3000
```

### Issue 4: Build Fails

**Symptom**: `npm run build` throws errors

**Fix**:
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for ESLint errors: `npm run lint`
- Ensure all imports are correct (no missing files)
- Check for TypeScript errors if using TypeScript

### Issue 5: Dark Mode Not Working

**Symptom**: Dark mode toggle doesn't work

**Fix**:
- Check browser localStorage for theme preference
- Verify `ThemeContext` is properly wrapped around App
- Ensure TailwindCSS dark mode is enabled in config

### Issue 6: Images Not Loading

**Symptom**: Pet images show broken image icon

**Fix**:
- Check image URLs are absolute paths (CDN or backend URL)
- Verify backend `/uploads` endpoint is accessible
- Check CORS headers on image requests
- Ensure `VITE_API_BASE` is configured correctly

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push code to GitHub**

2. **Import project to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure build settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client/`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Set environment variables**:
   ```
   VITE_API_BASE=https://your-backend-domain.com/api
   ```

5. **Deploy**: Click "Deploy"

### Deploy to Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configure environment variables** in Netlify dashboard

### Deploy as Static Site

Build and upload `dist/` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- DigitalOcean App Platform
- Cloudflare Pages

---

## 🧪 Testing (Future)

Testing setup is ready for implementation:

```bash
# Run unit tests (to be implemented)
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

Recommended testing libraries:
- **Vitest** (Vite-native test runner)
- **React Testing Library** (component testing)
- **MSW** (API mocking)

---

## 📚 Key Features & Components

### Custom Hooks
- `useAuth()` - Access authentication state and methods
- `useTheme()` - Access and toggle theme
- (Additional hooks in `src/hooks/`)

### Context Providers
- `AuthProvider` - Manages user authentication state
- `ThemeProvider` - Manages dark/light theme
- (Additional providers in `src/contexts/`)

### Protected Routes
The `ProtectedRoute` component wraps routes that require authentication:
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <Dashboard />
  </ProtectedRoute>
} />
```

For admin-only routes:
```jsx
<Route path="/admin" element={
  <ProtectedRoute adminOnly>
    <AdminDashboard />
  </ProtectedRoute>
} />
```

---

## 🎯 Best Practices

1. **Component Organization**: Keep components small and focused
2. **State Management**: Use Context API for global state, local state for component-specific data
3. **API Calls**: Centralize API calls in `services/` directory
4. **Error Handling**: Always handle errors gracefully with try-catch
5. **Loading States**: Show loading indicators for async operations
6. **Responsive Design**: Use TailwindCSS responsive utilities
7. **Accessibility**: Use semantic HTML and ARIA labels
8. **Performance**: Use React.lazy() for code splitting large components

---

## 🔧 Troubleshooting

If you encounter issues:

1. **Clear cache and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json dist .vite
   npm install
   ```

2. **Check Node.js version**:
   ```bash
   node --version  # Should be v18+ or higher
   ```

3. **Verify environment variables**:
   ```bash
   # Create .env.local if missing
   cp .env.example .env.local
   ```

4. **Check backend connectivity**:
   - Ensure backend is running on port 5000
   - Test API endpoint: `http://localhost:5000/api/health`

---

## 📖 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [TailwindCSS Documentation](https://tailwindcss.com)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)

---

## 👨‍💻 Contributing

When contributing to the frontend:

1. Follow the existing component structure
2. Use functional components with hooks
3. Maintain consistent naming conventions
4. Add PropTypes or TypeScript types where applicable
5. Test responsive design on multiple screen sizes
6. Run `npm run lint` before committing

---

**Built with React ⚛️ and TailwindCSS 💨**
