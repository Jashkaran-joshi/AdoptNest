# Backend APIs

## 🌐 API Overview

All API endpoints are prefixed with `/api` and return JSON responses.

**Base URL**: `http://localhost:5000/api` (development)

## 📋 API Endpoints

### 🔐 Authentication APIs (`/api/auth`)

#### POST `/api/auth/signup`
- **Purpose**: Register new user
- **Access**: Public
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "city": "Mumbai"
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "user": { "id": "...", "name": "...", "email": "..." },
    "token": "jwt_token_here"
  }
  ```

#### POST `/api/auth/login`
- **Purpose**: User login
- **Access**: Public
- **Body**: 
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: User object and JWT token

#### POST `/api/auth/logout`
- **Purpose**: User logout
- **Access**: Protected
- **Headers**: `Authorization: Bearer <token>`

#### POST `/api/auth/forgot-password`
- **Purpose**: Request password reset
- **Access**: Public
- **Body**: `{ "email": "john@example.com" }`

#### POST `/api/auth/reset-password`
- **Purpose**: Reset password with token
- **Access**: Public
- **Body**: 
  ```json
  {
    "token": "reset_token",
    "password": "newpassword123"
  }
  ```

#### GET `/api/auth/verify-email/:token`
- **Purpose**: Verify email address
- **Access**: Public

### 🐾 Pet APIs (`/api/pets`)

#### GET `/api/pets`
- **Purpose**: Get all pets (with filters)
- **Access**: Public
- **Query Params**: 
  - `type`: Pet type (Dog, Cat, etc.)
  - `age`: Age group (Young, Adult, Senior)
  - `location`: Location filter
  - `search`: Search term
  - `status`: Status filter
  - `page`: Page number
  - `limit`: Items per page

#### GET `/api/pets/:id`
- **Purpose**: Get single pet
- **Access**: Public

#### POST `/api/pets`
- **Purpose**: Create new pet
- **Access**: Protected (Admin only)
- **Body**: FormData with pet data and image file

#### PUT `/api/pets/:id`
- **Purpose**: Update pet
- **Access**: Protected (Admin only)
- **Body**: FormData with updated pet data

#### DELETE `/api/pets/:id`
- **Purpose**: Delete pet
- **Access**: Protected (Admin only)

### 📝 Adoption APIs (`/api/adoptions`)

#### POST `/api/adoptions`
- **Purpose**: Submit adoption application
- **Access**: Protected
- **Body**: Adoption application data

#### GET `/api/adoptions`
- **Purpose**: Get adoptions (user's or all for admin)
- **Access**: Protected

#### GET `/api/adoptions/:id`
- **Purpose**: Get single adoption
- **Access**: Protected

#### PATCH `/api/adoptions/:id`
- **Purpose**: Update adoption status
- **Access**: Protected (Admin only)
- **Body**: `{ "status": "Approved" }`

### 🏥 Surrender APIs (`/api/surrenders`)

#### POST `/api/surrenders`
- **Purpose**: Submit surrender request
- **Access**: Protected
- **Body**: FormData with surrender data and image

#### GET `/api/surrenders`
- **Purpose**: Get surrenders
- **Access**: Protected

#### GET `/api/surrenders/:id`
- **Purpose**: Get single surrender
- **Access**: Protected

#### PATCH `/api/surrenders/:id`
- **Purpose**: Update surrender status
- **Access**: Protected (Admin only)

### 📅 Booking APIs (`/api/bookings`)

#### POST `/api/bookings`
- **Purpose**: Create booking
- **Access**: Protected
- **Body**: Booking data (service, date, time, etc.)

#### GET `/api/bookings`
- **Purpose**: Get bookings
- **Access**: Protected

#### GET `/api/bookings/:id`
- **Purpose**: Get single booking
- **Access**: Protected

#### PUT `/api/bookings/:id`
- **Purpose**: Update booking
- **Access**: Protected

#### DELETE `/api/bookings/:id`
- **Purpose**: Cancel booking
- **Access**: Protected

### 💬 Contact APIs (`/api/contact`)

#### POST `/api/contact`
- **Purpose**: Submit contact form
- **Access**: Public
- **Body**: 
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello..."
  }
  ```

#### GET `/api/contact`
- **Purpose**: Get contact messages
- **Access**: Protected (Admin only)

#### PATCH `/api/contact/:id`
- **Purpose**: Mark message as read
- **Access**: Protected (Admin only)

### 👤 User APIs (`/api/users`)

#### GET `/api/users/me`
- **Purpose**: Get current user profile
- **Access**: Protected

#### PUT `/api/users/me`
- **Purpose**: Update user profile
- **Access**: Protected

### 👨‍💼 Admin APIs (`/api/admin`)

#### GET `/api/admin/stats`
- **Purpose**: Get admin statistics
- **Access**: Protected (Admin only)

#### GET `/api/admin/users`
- **Purpose**: Get all users
- **Access**: Protected (Admin only)

#### PATCH `/api/admin/users/:id`
- **Purpose**: Update user (role, status)
- **Access**: Protected (Admin only)

### 📖 Success Story APIs (`/api/stories`)

#### GET `/api/stories`
- **Purpose**: Get success stories
- **Access**: Public

#### GET `/api/stories/:id`
- **Purpose**: Get single story
- **Access**: Public

#### POST `/api/stories`
- **Purpose**: Create story
- **Access**: Protected (Admin only)
- **Body**: FormData with story data and image

#### PUT `/api/stories/:id`
- **Purpose**: Update story
- **Access**: Protected (Admin only)

#### DELETE `/api/stories/:id`
- **Purpose**: Delete story
- **Access**: Protected (Admin only)

### 🤝 Volunteer APIs (`/api/volunteers`)

#### POST `/api/volunteers`
- **Purpose**: Submit volunteer application
- **Access**: Protected

#### GET `/api/volunteers`
- **Purpose**: Get volunteers
- **Access**: Protected (Admin only)

#### GET `/api/volunteers/:id`
- **Purpose**: Get single volunteer
- **Access**: Protected (Admin only)

#### PUT `/api/volunteers/:id`
- **Purpose**: Update volunteer
- **Access**: Protected (Admin only)

#### DELETE `/api/volunteers/:id`
- **Purpose**: Delete volunteer
- **Access**: Protected (Admin only)

### 💰 Donation Contact APIs (`/api/donation-contact`)

#### POST `/api/donation-contact`
- **Purpose**: Submit donation contact
- **Access**: Protected

#### GET `/api/donation-contact`
- **Purpose**: Get donation contacts
- **Access**: Protected (Admin only)

#### GET `/api/donation-contact/:id`
- **Purpose**: Get single donation contact
- **Access**: Protected (Admin only)

#### PUT `/api/donation-contact/:id`
- **Purpose**: Update donation contact
- **Access**: Protected (Admin only)

#### DELETE `/api/donation-contact/:id`
- **Purpose**: Delete donation contact
- **Access**: Protected (Admin only)

### 📰 Blog APIs (`/api/blog`)

#### GET `/api/blog`
- **Purpose**: Get blog posts
- **Access**: Public

#### GET `/api/blog/:id`
- **Purpose**: Get single blog post
- **Access**: Public

#### POST `/api/blog`
- **Purpose**: Create blog post
- **Access**: Protected (Admin only)
- **Body**: FormData with blog data and image

#### PUT `/api/blog/:id`
- **Purpose**: Update blog post
- **Access**: Protected (Admin only)

#### DELETE `/api/blog/:id`
- **Purpose**: Delete blog post
- **Access**: Protected (Admin only)

### 🏥 Health Check API

#### GET `/api/health`
- **Purpose**: Server and database health check
- **Access**: Public
- **Response**: Server status and database connection status

## 🔒 Authentication

Most endpoints require authentication via JWT token:

```
Authorization: Bearer <jwt_token>
```

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## 🚦 Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `422`: Validation Error
- `429`: Rate Limit Exceeded
- `500`: Server Error
- `503`: Service Unavailable

---

**Next**: See [Routes Documentation](./routes.md) for route definitions.

