# Frontend Components

## 📦 Component Categories

### Layout Components (`components/layout/`)

#### Navbar.jsx
- **Purpose**: Main navigation bar
- **Features**: 
  - Responsive mobile menu
  - User authentication state
  - Admin/user navigation links
  - Search functionality
- **Props**: None (uses AuthContext)
- **Usage**: Rendered in App.jsx

#### Footer.jsx
- **Purpose**: Site footer
- **Features**: 
  - Links to legal pages
  - Social media links
  - Copyright information
- **Props**: None
- **Usage**: Rendered in App.jsx

#### Breadcrumbs.jsx
- **Purpose**: Navigation breadcrumbs
- **Props**: 
  - `items`: Array of breadcrumb items
- **Usage**: Used in detail pages

#### ErrorBoundary.jsx
- **Purpose**: Catches React errors
- **Features**: 
  - Error fallback UI
  - Error logging
- **Props**: 
  - `children`: Child components
- **Usage**: Wraps app or sections

### UI Components (`components/ui/`)

#### PetCard.jsx
- **Purpose**: Display pet information card
- **Props**:
  - `pet`: Pet object
  - `onClick`: Click handler
  - `showFavorite`: Boolean
- **Features**: 
  - Pet image, name, type, location
  - Favorite button
  - Status badge

#### BlogCard.jsx
- **Purpose**: Display blog post card
- **Props**:
  - `post`: Blog post object
  - `onClick`: Click handler
- **Features**: 
  - Blog image, title, excerpt
  - Category badge
  - Read time

#### Loading.jsx
- **Purpose**: Loading spinner
- **Props**: 
  - `size`: Size variant
  - `text`: Optional loading text
- **Usage**: Shown during data fetching

#### Skeleton.jsx
- **Purpose**: Loading skeleton placeholder
- **Props**: 
  - `type`: Skeleton type (card, list, etc.)
- **Usage**: Shown while content loads

#### FiltersBar.jsx
- **Purpose**: Pet filtering interface
- **Props**:
  - `filters`: Current filter values
  - `onFilterChange`: Filter change handler
- **Features**: 
  - Type filter
  - Age filter
  - Location filter
  - Search input

### Feature Components (`components/features/`)

#### ProtectedRoute.jsx
- **Purpose**: Route protection wrapper
- **Props**:
  - `children`: Protected component
  - `adminOnly`: Boolean (admin-only route)
- **Features**: 
  - Checks authentication
  - Redirects to login if not authenticated
  - Checks admin role for admin routes
- **Usage**: Wraps protected routes in App.jsx

#### NotificationBell.jsx
- **Purpose**: Notification indicator
- **Props**: None (uses NotificationContext)
- **Features**: 
  - Notification count badge
  - Click to view notifications
- **Usage**: In Navbar

## 🎨 Component Patterns

### Props Pattern
```jsx
// Destructured props
function Component({ prop1, prop2, ...rest }) {
  return <div>{prop1}</div>;
}
```

### Context Pattern
```jsx
// Using context
const { user } = useAuth();
const { favorites } = useFavorites();
```

### State Pattern
```jsx
// Local state
const [state, setState] = useState(initialValue);

// Effect for side effects
useEffect(() => {
  // Side effect
}, [dependencies]);
```

## 🔄 Component Lifecycle

1. **Mount**: Component renders
2. **Update**: Props/state change
3. **Unmount**: Component removed

## 📝 Component Best Practices

1. **Single Responsibility**: One component, one purpose
2. **Reusability**: Make components reusable
3. **Props Validation**: Use TypeScript or PropTypes
4. **Performance**: Use React.memo for expensive components
5. **Accessibility**: Include ARIA labels and semantic HTML

## 🎯 Component Usage Examples

### Using PetCard
```jsx
<PetCard 
  pet={petData} 
  onClick={() => navigate(`/adopt/${petData._id}`)}
  showFavorite={true}
/>
```

### Using ProtectedRoute
```jsx
<ProtectedRoute adminOnly>
  <AdminDashboard />
</ProtectedRoute>
```

### Using Loading
```jsx
{loading ? <Loading /> : <Content />}
```

---

**Next**: See [Pages Documentation](./pages.md) for page components.

