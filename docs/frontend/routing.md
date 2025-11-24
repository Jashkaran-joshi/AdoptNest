# Frontend Routing

## 🛣️ Routing System

The application uses **React Router v7** for client-side routing.

## 📍 Route Configuration

All routes are defined in `src/App.jsx` using React Router's `<Routes>` and `<Route>` components.

## 🔐 Route Types

### Public Routes
Accessible to everyone (no authentication required):
- `/` - Home
- `/adopt` - Browse pets
- `/adopt/:id` - Pet details
- `/blog` - Blog listing
- `/blog/:slug` - Blog post
- `/about` - About page
- `/faq` - FAQ page
- `/success-stories` - Success stories
- `/login` - Login page
- `/signup` - Signup page
- `/forgot` - Forgot password
- `/reset-password/:token` - Reset password
- `/verify-email/:token` - Verify email
- `/contact` - Contact form
- `/privacy` - Privacy policy
- `/terms` - Terms of service

### Protected Routes
Require user authentication (login):
- `/dashboard/*` - User dashboard
- `/favorites` - Favorite pets
- `/bookings` - Service bookings
- `/adopt/apply` - Adoption form
- `/adopt/apply/:id` - Adoption form for specific pet
- `/give` - Surrender pet
- `/volunteer` - Volunteer application
- `/donate` - Donation form
- `/book-service` - Book service
- `/book-service/:petId` - Book service for pet
- `/dashboard/view/:type/:id` - View item details

### Admin Routes
Require admin role:
- `/admin/*` - Admin dashboard
- `/admin/add` - Add pet
- `/admin/users` - User management
- `/admin/view/:type/:id` - View/manage item

## 🛡️ Route Protection

### ProtectedRoute Component

The `ProtectedRoute` component wraps protected routes:

```jsx
<ProtectedRoute>
  <Dashboard />
</ProtectedRoute>
```

**Features**:
- Checks if user is authenticated
- Redirects to `/login` if not authenticated
- Supports `adminOnly` prop for admin routes

### Usage Examples

**User Route**:
```jsx
<Route
  path="/dashboard/*"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

**Admin Route**:
```jsx
<Route
  path="/admin/*"
  element={
    <ProtectedRoute adminOnly>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

## 🔄 Navigation

### Programmatic Navigation

Use React Router's `useNavigate` hook:

```jsx
import { useNavigate } from 'react-router-dom';

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/dashboard');
  };
}
```

### Link Navigation

Use React Router's `Link` component:

```jsx
import { Link } from 'react-router-dom';

<Link to="/adopt">Browse Pets</Link>
```

## 📋 Route Parameters

### Dynamic Routes

Routes with parameters:
- `/adopt/:id` - Pet ID
- `/blog/:slug` - Blog slug
- `/reset-password/:token` - Reset token
- `/verify-email/:token` - Verification token
- `/dashboard/view/:type/:id` - Item type and ID
- `/admin/view/:type/:id` - Item type and ID
- `/book-service/:petId` - Pet ID

### Accessing Parameters

Use `useParams` hook:

```jsx
import { useParams } from 'react-router-dom';

function PetDetails() {
  const { id } = useParams();
  // Use id to fetch pet data
}
```

## 🔍 Query Parameters

### Reading Query Parameters

Use `useSearchParams` hook:

```jsx
import { useSearchParams } from 'react-router-dom';

function Component() {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page');
  const filter = searchParams.get('filter');
}
```

### Setting Query Parameters

```jsx
const [searchParams, setSearchParams] = useSearchParams();
setSearchParams({ page: '2', filter: 'dogs' });
```

## 🎯 Route Matching

### Exact Matching
Routes match exactly by default.

### Catch-All Route
The `*` route catches all unmatched paths:

```jsx
<Route path="*" element={<NotFound />} />
```

## 🔄 Route Transitions

### Loading States
Show loading during route transitions:

```jsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchData().then(() => setLoading(false));
}, []);
```

## 📱 Route Structure

```
/                           → Home
/adopt                      → Browse pets
/adopt/:id                  → Pet details
/adopt/apply                → Adoption form
/adopt/apply/:id            → Adoption form (specific pet)
/give                       → Surrender pet
/login                      → Login
/signup                     → Signup
/forgot                     → Forgot password
/reset-password/:token      → Reset password
/verify-email/:token        → Verify email
/dashboard/*                → User dashboard
/favorites                  → Favorite pets
/bookings                   → Service bookings
/book-service               → Book service
/book-service/:petId        → Book service (specific pet)
/volunteer                  → Volunteer application
/donate                     → Donation form
/contact                    → Contact form
/blog                       → Blog listing
/blog/:slug                 → Blog post
/success-stories            → Success stories
/about                      → About page
/faq                        → FAQ page
/privacy                    → Privacy policy
/terms                      → Terms of service
/admin/*                    → Admin dashboard
/admin/add                  → Add pet
/admin/users                → User management
/admin/view/:type/:id       → Admin view item
/dashboard/view/:type/:id   → User view item
*                           → 404 Not Found
```

---

**Next**: See [Styling Documentation](./styling.md) for styling information.

