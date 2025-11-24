# Frontend Pages

## 📄 Page Components Overview

All pages are located in `src/pages/` and organized by feature.

## 🏠 Content Pages (`pages/content/`)

### Home.jsx
- **Route**: `/`
- **Purpose**: Landing page
- **Features**: 
  - Hero section
  - Featured pets
  - Statistics
  - Call-to-action sections
- **Access**: Public

### Blog.jsx
- **Route**: `/blog`
- **Purpose**: Blog listing page
- **Features**: 
  - Blog post grid
  - Category filters
  - Pagination
- **Access**: Public

### BlogPost.jsx
- **Route**: `/blog/:slug`
- **Purpose**: Individual blog post
- **Features**: 
  - Full blog content
  - Related posts
  - Share functionality
- **Access**: Public

### About.jsx
- **Route**: `/about`
- **Purpose**: About us page
- **Features**: 
  - Mission statement
  - Team information
  - Organization history
- **Access**: Public

### FAQ.jsx
- **Route**: `/faq`
- **Purpose**: Frequently asked questions
- **Features**: 
  - Expandable Q&A sections
  - Search functionality
- **Access**: Public

### SuccessStories.jsx
- **Route**: `/success-stories`
- **Purpose**: Adoption success stories
- **Features**: 
  - Story cards
  - Filter by pet type
  - Search functionality
- **Access**: Public

## 🐾 Pet Pages (`pages/pets/`)

### Adopt.jsx
- **Route**: `/adopt`
- **Purpose**: Browse available pets
- **Features**: 
  - Pet grid with filters
  - Search functionality
  - Pagination
  - Filter by type, age, location
- **Access**: Public

### PetDetails.jsx
- **Route**: `/adopt/:id`
- **Purpose**: Pet detail page
- **Features**: 
  - Pet information
  - Image gallery
  - Adoption button
  - Favorite button
  - Share functionality
- **Access**: Public

### AdoptionForm.jsx
- **Route**: `/adopt/apply` or `/adopt/apply/:id`
- **Purpose**: Adoption application form
- **Features**: 
  - Multi-step form
  - Validation
  - Pet selection
  - Application submission
- **Access**: Protected (requires login)

### GivePet.jsx
- **Route**: `/give`
- **Purpose**: Surrender a pet
- **Features**: 
  - Surrender form
  - Image upload
  - Pet information collection
- **Access**: Protected (requires login)

## 🔐 Authentication Pages (`pages/auth/`)

### Login.jsx
- **Route**: `/login`
- **Purpose**: User login
- **Features**: 
  - Email/password form
  - Remember me option
  - Forgot password link
  - Redirect after login
- **Access**: Public (redirects if logged in)

### Signup.jsx
- **Route**: `/signup`
- **Purpose**: User registration
- **Features**: 
  - Registration form
  - Email validation
  - Password strength indicator
  - Terms acceptance
- **Access**: Public (redirects if logged in)

### ForgotPassword.jsx
- **Route**: `/forgot`
- **Purpose**: Password reset request
- **Features**: 
  - Email input
  - Reset link sending
- **Access**: Public

### ResetPassword.jsx
- **Route**: `/reset-password/:token`
- **Purpose**: Password reset form
- **Features**: 
  - New password input
  - Token validation
  - Password confirmation
- **Access**: Public

### VerifyEmail.jsx
- **Route**: `/verify-email/:token`
- **Purpose**: Email verification
- **Features**: 
  - Token validation
  - Verification status
- **Access**: Public

## 👤 User Pages (`pages/user/`)

### Dashboard.jsx
- **Route**: `/dashboard/*`
- **Purpose**: User dashboard
- **Features**: 
  - Adoption applications
  - Bookings
  - Surrenders
  - Profile information
- **Access**: Protected (requires login)

### Favorites.jsx
- **Route**: `/favorites`
- **Purpose**: Favorite pets list
- **Features**: 
  - Favorite pets grid
  - Remove from favorites
  - Quick adoption
- **Access**: Protected (requires login)

### Bookings.jsx
- **Route**: `/bookings`
- **Purpose**: Service bookings
- **Features**: 
  - Booking list
  - Booking details
  - Cancel booking
  - Edit booking
- **Access**: Protected (requires login)

### ViewItem.jsx
- **Route**: `/dashboard/view/:type/:id`
- **Purpose**: View item details
- **Features**: 
  - Adoption details
  - Booking details
  - Surrender details
- **Access**: Protected (requires login)

## 👨‍💼 Admin Pages (`pages/admin/`)

### AdminDashboard.jsx
- **Route**: `/admin/*`
- **Purpose**: Admin dashboard
- **Features**: 
  - Statistics overview
  - Recent activities
  - Quick actions
  - Data management
- **Access**: Protected (admin only)

### AdminAddPet.jsx
- **Route**: `/admin/add`
- **Purpose**: Add new pet
- **Features**: 
  - Pet form
  - Image upload
  - Pet information
- **Access**: Protected (admin only)

### AdminUsers.jsx
- **Route**: `/admin/users`
- **Purpose**: User management
- **Features**: 
  - User list
  - User search
  - Role management
  - Status management
- **Access**: Protected (admin only)

### AdminViewItem.jsx
- **Route**: `/admin/view/:type/:id`
- **Purpose**: View and manage items
- **Features**: 
  - Item details
  - Status updates
  - Edit functionality
  - Delete functionality
- **Access**: Protected (admin only)

## 🛠️ Service Pages (`pages/services/`)

### BookService.jsx
- **Route**: `/book-service` or `/book-service/:petId`
- **Purpose**: Book a service
- **Features**: 
  - Service selection
  - Date/time picker
  - Pet selection
  - Booking form
- **Access**: Protected (requires login)

## 💬 Support Pages (`pages/support/`)

### Contact.jsx
- **Route**: `/contact`
- **Purpose**: Contact form
- **Features**: 
  - Contact form
  - Message submission
- **Access**: Public

### Donate.jsx
- **Route**: `/donate`
- **Purpose**: Donation form
- **Features**: 
  - Donation form
  - Purpose selection
  - Message field
- **Access**: Protected (requires login)

### Volunteer.jsx
- **Route**: `/volunteer`
- **Purpose**: Volunteer application
- **Features**: 
  - Volunteer form
  - Type selection (volunteer/foster)
  - Availability
  - Experience
- **Access**: Protected (requires login)

## ⚖️ Legal Pages (`pages/legal/`)

### Privacy.jsx
- **Route**: `/privacy`
- **Purpose**: Privacy policy
- **Access**: Public

### Terms.jsx
- **Route**: `/terms`
- **Purpose**: Terms of service
- **Access**: Public

## 🔍 Common Pages (`pages/common/`)

### NotFound.jsx
- **Route**: `*` (catch-all)
- **Purpose**: 404 error page
- **Features**: 
  - Error message
  - Back to home link
- **Access**: Public

## 🛣️ Route Protection

- **Public Routes**: Home, Blog, About, Login, Signup
- **Protected Routes**: Dashboard, Favorites, Bookings (require login)
- **Admin Routes**: All `/admin/*` routes (require admin role)

---

**Next**: See [Routing Documentation](./routing.md) for route configuration.

