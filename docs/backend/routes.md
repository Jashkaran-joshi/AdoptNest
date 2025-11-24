# Backend Routes

## 🛣️ Route Structure

All routes are registered in `server/src/routes/index.js` and mounted at `/api`.

## 📁 Route Modules

### Authentication Routes (`/api/auth`)
- **File**: `routes/authRoutes.js`
- **Endpoints**: signup, login, logout, forgot-password, reset-password, verify-email

### Pet Routes (`/api/pets`)
- **File**: `routes/petRoutes.js`
- **Endpoints**: CRUD operations for pets
- **Protection**: Create/Update/Delete require admin

### Adoption Routes (`/api/adoptions`)
- **File**: `routes/adoptionRoutes.js`
- **Endpoints**: Adoption applications
- **Protection**: All routes protected

### Surrender Routes (`/api/surrenders`)
- **File**: `routes/surrenderRoutes.js`
- **Endpoints**: Pet surrender requests
- **Protection**: All routes protected

### Booking Routes (`/api/bookings`)
- **File**: `routes/bookingRoutes.js`
- **Endpoints**: Service bookings
- **Protection**: All routes protected

### Contact Routes (`/api/contact`)
- **File**: `routes/contactRoutes.js`
- **Endpoints**: Contact form submissions
- **Protection**: GET/PATCH require admin

### User Routes (`/api/users`)
- **File**: `routes/userRoutes.js`
- **Endpoints**: User profile management
- **Protection**: All routes protected

### Admin Routes (`/api/admin`)
- **File**: `routes/adminRoutes.js`
- **Endpoints**: Admin operations
- **Protection**: All routes require admin

### Story Routes (`/api/stories`)
- **File**: `routes/storyRoutes.js`
- **Endpoints**: Success stories
- **Protection**: Create/Update/Delete require admin

### Volunteer Routes (`/api/volunteers`)
- **File**: `routes/volunteerRoutes.js`
- **Endpoints**: Volunteer applications
- **Protection**: GET/UPDATE/DELETE require admin

### Donation Contact Routes (`/api/donation-contact`)
- **File**: `routes/donationContactRoutes.js`
- **Endpoints**: Donation contacts
- **Protection**: GET/UPDATE/DELETE require admin

### Blog Routes (`/api/blog`)
- **File**: `routes/blogRoutes.js`
- **Endpoints**: Blog posts
- **Protection**: Create/Update/Delete require admin

### Upload Routes (`/api/upload`)
- **File**: `routes/uploadRoutes.js`
- **Endpoints**: File upload handling

## 🔗 Route Registration

Routes are registered in `routes/index.js`:

```javascript
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
// ... etc
```

## 🛡️ Route Protection

### Public Routes
- GET `/api/pets`
- GET `/api/pets/:id`
- GET `/api/stories`
- GET `/api/blog`
- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/contact`

### Protected Routes
All other routes require authentication via `protect` middleware.

### Admin Routes
Routes with `authorize('admin')` middleware require admin role.

## 📝 Route Middleware Order

1. **Validation**: Zod schema validation
2. **Authentication**: `protect` middleware
3. **Authorization**: `authorize` middleware (if needed)
4. **File Upload**: Multer middleware (if needed)
5. **Controller**: Route handler

---

**Next**: See [Controllers Documentation](./controllers.md).

