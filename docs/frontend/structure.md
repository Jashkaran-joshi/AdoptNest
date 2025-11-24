# Frontend Structure

## 📁 Project Structure

```
client/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── vite.svg
├── src/
│   ├── assets/            # Images, icons, fonts
│   ├── components/        # Reusable React components
│   │   ├── features/      # Feature-specific components
│   │   ├── layout/       # Layout components (Navbar, Footer)
│   │   └── ui/           # UI components (Cards, Buttons, etc.)
│   ├── config/           # Configuration files
│   ├── constants/        # Constants and enums
│   ├── contexts/         # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── auth/         # Authentication pages
│   │   ├── common/       # Common pages (404, etc.)
│   │   ├── content/      # Content pages (Home, Blog, etc.)
│   │   ├── legal/        # Legal pages (Privacy, Terms)
│   │   ├── pets/         # Pet-related pages
│   │   ├── services/     # Service pages
│   │   ├── support/      # Support pages
│   │   └── user/         # User dashboard pages
│   ├── services/         # API service layer
│   ├── utils/            # Utility functions
│   │   └── helpers/      # Helper functions
│   ├── App.jsx           # Main app component with routes
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── postcss.config.js     # PostCSS configuration
```

## 🎯 Key Directories

### `/src/components/`
Reusable React components organized by purpose:
- **features/**: Feature-specific components (ProtectedRoute, NotificationBell)
- **layout/**: Layout components (Navbar, Footer, Breadcrumbs, ErrorBoundary)
- **ui/**: Generic UI components (PetCard, BlogCard, Loading, Skeleton, FiltersBar)

### `/src/pages/`
Page components organized by feature:
- **admin/**: Admin dashboard and management pages
- **auth/**: Login, signup, password reset pages
- **content/**: Public content pages (Home, Blog, About, FAQ, Success Stories)
- **pets/**: Pet browsing, details, adoption forms
- **services/**: Service booking pages
- **support/**: Contact, volunteer, donation pages
- **user/**: User dashboard and profile pages

### `/src/contexts/`
React Context providers for global state:
- **AuthContext**: User authentication state
- **FavoritesContext**: Favorite pets management
- **NotificationContext**: Notification system
- **ThemeContext**: Theme management

### `/src/services/`
API service layer:
- **api.js**: Axios instance with interceptors and all API endpoints

### `/src/utils/`
Utility functions and helpers:
- **helpers/**: Error handling, image URLs, rate limiting, sanitization, sharing

## 📦 Entry Points

### `main.jsx`
- React app entry point
- Renders App component
- Sets up React Router

### `App.jsx`
- Main application component
- Defines all routes
- Wraps app with layout components (Navbar, Footer)
- Handles route protection

## 🔧 Configuration Files

### `vite.config.js`
- Vite build tool configuration
- React plugin setup
- Build optimizations

### `tailwind.config.js`
- Tailwind CSS configuration
- Custom color palette (primary, accent)
- Custom spacing, typography, animations
- Responsive breakpoints

### `package.json`
- Project dependencies
- Scripts for development, building, linting
- React 19, Vite, Tailwind CSS, Axios

## 🎨 Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Theme**: Primary (orange) and accent (green) colors
- **Responsive Design**: Mobile-first approach
- **Global Styles**: `index.css` for base styles

## 🔄 Data Flow

1. **User Action** → Component
2. **Component** → API Service (`services/api.js`)
3. **API Service** → Backend API
4. **Response** → Context/State Update
5. **State Update** → UI Re-render

## 📱 Responsive Breakpoints

- **xs**: 475px
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

---

**Next**: See [Components Documentation](./components.md) for detailed component information.

