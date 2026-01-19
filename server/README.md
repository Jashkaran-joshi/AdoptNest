# AdoptNest Server (Backend)

**RESTful API backend for the AdoptNest pet adoption platform**

This is the backend API server for AdoptNest, built with Node.js, Express, and MongoDB. It provides secure, scalable endpoints for managing pets, users, adoptions, bookings, and all platform functionality.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB with Mongoose ODM 8.9.2
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Password Hashing**: bcryptjs 2.4.3
- **Validation**: Zod 3.24.1
- **File Upload**: Multer 1.4.5-lts.1
- **Security**: 
  - Helmet 8.0.0 (HTTP headers)
  - CORS 2.8.5 (Cross-Origin Resource Sharing)
  - express-rate-limit 7.4.1 (Rate limiting)
  - express-mongo-sanitize 2.2.0 (NoSQL injection prevention)
- **Email**: Nodemailer 6.9.16
- **Environment**: dotenv 16.4.7
- **Testing**: Jest 29.7.0, Supertest 7.0.0
- **Dev Tools**: Nodemon 3.1.9, ESLint 9.39.1, Prettier 3.6.2

---

## 📁 Folder Structure

```
server/
├── src/
│   ├── app.js                   # Express app configuration
│   │
│   ├── config/                  # Configuration files
│   │   ├── index.js             # Centralized config export
│   │   ├── database.js          # MongoDB connection logic
│   │   └── ...
│   │
│   ├── controllers/             # Route handlers (business logic)
│   │   ├── authController.js    # Authentication logic
│   │   ├── petController.js     # Pet CRUD operations
│   │   ├── adoptionController.js
│   │   ├── surrenderController.js
│   │   ├── bookingController.js
│   │   ├── contactController.js
│   │   ├── userController.js
│   │   ├── adminController.js
│   │   ├── blogController.js
│   │   ├── successStoryController.js
│   │   ├── volunteerController.js
│   │   ├── donationContactController.js
│   │   ├── uploadController.js
│   │   └── index.js             # Controller exports
│   │
│   ├── models/                  # Mongoose schemas/models
│   │   ├── User.js              # User model
│   │   ├── Pet.js               # Pet model
│   │   ├── Adoption.js          # Adoption application model
│   │   ├── Surrender.js         # Pet surrender model
│   │   ├── Booking.js           # Service booking model
│   │   ├── ContactMessage.js    # Contact form model
│   │   ├── BlogPost.js          # Blog post model
│   │   ├── SuccessStory.js      # Success story model
│   │   ├── Volunteer.js         # Volunteer application model
│   │   ├── DonationContact.js   # Donation inquiry model
│   │   ├── Token.js             # Password reset token model
│   │   └── index.js             # Model exports
│   │
│   ├── routes/                  # API route definitions
│   │   ├── authRoutes.js        # /api/auth/*
│   │   ├── petRoutes.js         # /api/pets/*
│   │   ├── adoptionRoutes.js    # /api/adoptions/*
│   │   ├── surrenderRoutes.js   # /api/surrenders/*
│   │   ├── bookingRoutes.js     # /api/bookings/*
│   │   ├── contactRoutes.js     # /api/contact/*
│   │   ├── userRoutes.js        # /api/users/*
│   │   ├── adminRoutes.js       # /api/admin/*
│   │   ├── blogRoutes.js        # /api/blog/*
│   │   ├── storyRoutes.js       # /api/stories/*
│   │   ├── volunteerRoutes.js   # /api/volunteers/*
│   │   ├── donationContactRoutes.js  # /api/donation-contact/*
│   │   ├── uploadRoutes.js      # /api/upload/*
│   │   └── index.js             # Route aggregator
│   │
│   ├── middleware/              # Express middleware
│   │   ├── auth.js              # JWT authentication middleware
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── notFound.js          # 404 handler
│   │   ├── dbCheck.js           # Database connection check
│   │   └── index.js             # Middleware exports
│   │
│   ├── services/                # Business logic services
│   │   ├── authService.js       # Authentication business logic
│   │   ├── petService.js        # Pet-related services
│   │   ├── bookingService.js    # Booking logic
│   │   ├── githubService.js     # GitHub CDN upload service
│   │   └── jsdelivrService.js   # jsDelivr CDN helper
│   │
│   ├── validators/              # Zod validation schemas
│   │   └── ...
│   │
│   ├── utils/                   # Utility functions
│   │   ├── errorResponse.js     # Error response formatter
│   │   ├── successResponse.js   # Success response formatter
│   │   └── ...
│   │
│   └── constants/               # App constants
│       └── ...
│
├── scripts/                     # Utility scripts
│   ├── seed-dev-data.js         # Seed database with sample data
│   └── ...
│
├── tests/                       # Test files
│   └── ...
│
├── uploads/                     # File upload directory (development)
│   ├── pets/                    # Pet images
│   ├── users/                   # User avatars
│   ├── blog/                    # Blog post images
│   └── stories/                 # Success story images
│
├── index.js                     # Server entry point
├── package.json                 # Dependencies & scripts
├── .env                         # Environment variables (not committed)
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── jest.config.js               # Jest configuration
└── Procfile                     # Heroku/Render deployment config
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm (comes with Node.js)

### Install Dependencies

```bash
cd server
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory. Use `.env.example` as a reference:

```env
# ========================================
# Server Configuration
# ========================================
NODE_ENV=development
PORT=5000

# ========================================
# Database Configuration
# ========================================
# For local MongoDB (ensure MongoDB is running):
# MONGODB_URI=mongodb://localhost:27017/adoptnest

# For MongoDB Atlas (cloud):
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adoptnest_db?retryWrites=true&w=majority

# ========================================
# JWT Configuration
# ========================================
# Generate a secure random string (min 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# ========================================
# Frontend URL (for CORS)
# ========================================
# Development:
FRONTEND_URL=http://localhost:5173

# Production (can be comma-separated for multiple):
# FRONTEND_URL=https://your-frontend-domain.com

# ========================================
# File Upload Configuration
# ========================================
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# ========================================
# Admin Account (for seeding)
# ========================================
ADMIN_EMAIL=admin@adoptnest.com
ADMIN_PASSWORD=admin123

# ========================================
# GitHub CDN Configuration (Optional)
# ========================================
# For production image hosting via jsDelivr
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-cdn-repo-name
GITHUB_REPO_BRANCH=main
GITHUB_TOKEN=your-github-personal-access-token
GITHUB_AUTO_UPLOAD=false

# ========================================
# Email Configuration (Optional)
# ========================================
# For password reset and email verification
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_FROM=AdoptNest <noreply@adoptnest.com>
```

### Environment Variable Reference

| Variable            | Required | Description                                          | Example                          |
|---------------------|----------|------------------------------------------------------|----------------------------------|
| `NODE_ENV`          | Yes      | Environment mode                                     | `development` or `production`    |
| `PORT`              | Yes      | Server port                                          | `5000`                           |
| `MONGODB_URI`       | Yes      | MongoDB connection string                            | `mongodb://localhost:27017/...`  |
| `JWT_SECRET`        | Yes      | Secret key for JWT signing (min 32 chars)            | `your-secret-key`                |
| `JWT_EXPIRE`        | Yes      | JWT token expiration time                            | `7d`, `24h`, `30m`               |
| `FRONTEND_URL`      | Yes      | Frontend URL(s) for CORS (comma-separated)           | `http://localhost:5173`          |
| `UPLOAD_DIR`        | Yes      | File upload directory                                | `uploads`                        |
| `MAX_FILE_SIZE`     | Yes      | Max file upload size in bytes                        | `5242880` (5MB)                  |
| `ADMIN_EMAIL`       | No       | Admin account email for seeding                      | `admin@adoptnest.com`            |
| `ADMIN_PASSWORD`    | No       | Admin account password for seeding                   | `admin123`                       |
| `GITHUB_REPO_OWNER` | No       | GitHub username for CDN uploads                      | `your-username`                  |
| `GITHUB_REPO_NAME`  | No       | GitHub repository name for CDN                       | `cdn-repo`                       |
| `GITHUB_TOKEN`      | No       | GitHub personal access token                         | `ghp_xxxxx`                      |
| `EMAIL_HOST`        | No       | SMTP host for email (future feature)                 | `smtp.gmail.com`                 |
| `EMAIL_USER`        | No       | SMTP email username                                  | `your-email@gmail.com`           |
| `EMAIL_PASS`        | No       | SMTP email password                                  | `your-app-password`              |

**Security Note**: Never commit `.env` to version control. Always use strong, unique values for `JWT_SECRET` in production.

---

## 💻 Running the Server

### Development Mode

Start the server with auto-restart on file changes:

```bash
npm run dev
```

Server will run on **http://localhost:5000**

### Production Mode

Start the server in production mode:

```bash
npm start
```

### Seed Development Data

Populate the database with sample data for testing:

```bash
npm run seed:dev
```

This creates:
- **Admin account**: admin@adoptnest.com / admin123
- **Sample users**: Multiple test user accounts
- **Sample pets**: 20+ pet listings with various attributes
- **Blog posts**: Sample blog content
- **Success stories**: Adoption success stories

**Important**: Only run this in development! It will clear existing data.

---

## 📜 Available Scripts

| Script         | Command                          | Description                                          |
|----------------|----------------------------------|------------------------------------------------------|
| `start`        | `node index.js`                  | Start server in production mode                      |
| `dev`          | `nodemon index.js`               | Start server with auto-restart (development)         |
| `build`        | `echo 'No build step required'`  | No build needed for Node.js                          |
| `test`         | `jest --coverage`                | Run tests with coverage report                       |
| `test:watch`   | `jest --watch`                   | Run tests in watch mode                              |
| `lint`         | `eslint src/ --ext .js`          | Check code quality                                   |
| `lint:fix`     | `eslint src/ --ext .js --fix`    | Fix linting issues automatically                     |
| `format`       | `prettier --write "src/**/*.js"` | Format code with Prettier                            |
| `seed:dev`     | `node scripts/seed-dev-data.js`  | Seed database with development data                  |

---

## 📖 API Documentation

### Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Health Check

**GET** `/api/health`

Check server and database status (public endpoint, no auth required).

**Response**:
```json
{
  "success": true,
  "server": {
    "status": "running",
    "environment": "development",
    "port": 5000,
    "timestamp": "2026-01-19T14:20:32.000Z"
  },
  "database": {
    "status": "connected",
    "isConnected": true,
    "readyState": 1,
    "host": "localhost:27017",
    "name": "adoptnest"
  }
}
```

---

### Authentication

#### Register New User
**POST** `/api/auth/signup`

**Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "1234567890"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

#### Login
**POST** `/api/auth/login`

**Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

#### Get Current User
**GET** `/api/auth/me`

**Headers**: `Authorization: Bearer <token>`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
  }
}
```

---

### Pets

#### Get All Pets (with filters)
**GET** `/api/pets`

**Query Parameters**:
- `species` - Filter by species (dog, cat, etc.)
- `breed` - Filter by breed
- `age` - Filter by age group (puppy, adult, senior)
- `size` - Filter by size (small, medium, large)
- `gender` - Filter by gender (male, female)
- `location` - Filter by location
- `status` - Filter by status (available, pending, adopted)
- `search` - Search in name and description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example**: `/api/pets?species=dog&age=puppy&page=1&limit=12`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "pets": [...],
    "pagination": {
      "total": 45,
      "page": 1,
      "pages": 4,
      "limit": 12
    }
  }
}
```

#### Get Single Pet
**GET** `/api/pets/:id`

**Response** (200):
```json
{
  "success": true,
  "data": {
    "pet": {
      "id": "...",
      "name": "Max",
      "species": "dog",
      "breed": "Golden Retriever",
      "age": 2,
      "description": "...",
      "images": ["https://..."],
      "status": "available"
    }
  }
}
```

#### Create Pet (Admin Only)
**POST** `/api/pets`

**Headers**: `Authorization: Bearer <admin-token>`

**Body** (multipart/form-data):
```json
{
  "name": "Max",
  "species": "dog",
  "breed": "Golden Retriever",
  "age": 2,
  "gender": "male",
  "size": "large",
  "description": "Friendly and playful",
  "location": "New York",
  "images": [<files>]
}
```

#### Update Pet (Admin Only)
**PUT** `/api/pets/:id`

**Headers**: `Authorization: Bearer <admin-token>`

#### Delete Pet (Admin Only)
**DELETE** `/api/pets/:id`

**Headers**: `Authorization: Bearer <admin-token>`

---

### Adoptions

#### Submit Adoption Application
**POST** `/api/adoptions`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "petId": "pet-id",
  "reason": "I love dogs and have a great home...",
  "experience": "I've had dogs before...",
  "housingType": "house",
  "hasYard": true
}
```

#### Get User's Adoptions
**GET** `/api/adoptions/my-adoptions`

**Headers**: `Authorization: Bearer <token>`

#### Update Adoption Status (Admin Only)
**PATCH** `/api/adoptions/:id/status`

**Headers**: `Authorization: Bearer <admin-token>`

**Body**:
```json
{
  "status": "approved",
  "notes": "Application looks great!"
}
```

---

### Bookings

#### Create Service Booking
**POST** `/api/bookings`

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "petId": "pet-id",
  "serviceType": "grooming",
  "date": "2026-01-25",
  "time": "10:00",
  "notes": "First time grooming"
}
```

#### Get User's Bookings
**GET** `/api/bookings/my-bookings`

**Headers**: `Authorization: Bearer <token>`

---

### Additional Endpoints

| Route                          | Method | Auth Required | Description                    |
|--------------------------------|--------|---------------|--------------------------------|
| `/api/surrenders`              | POST   | Yes           | Submit pet surrender form      |
| `/api/volunteers`              | POST   | Yes           | Submit volunteer application   |
| `/api/donation-contact`        | POST   | Yes           | Submit donation inquiry        |
| `/api/contact`                 | POST   | No            | Submit contact message         |
| `/api/blog`                    | GET    | No            | Get all blog posts             |
| `/api/blog/:slug`              | GET    | No            | Get single blog post           |
| `/api/stories`                 | GET    | No            | Get success stories            |
| `/api/users/profile`           | GET    | Yes           | Get user profile               |
| `/api/users/profile`           | PUT    | Yes           | Update user profile            |
| `/api/users/favorites`         | GET    | Yes           | Get user's favorite pets       |
| `/api/users/favorites/:petId`  | POST   | Yes           | Add pet to favorites           |
| `/api/users/favorites/:petId`  | DELETE | Yes           | Remove pet from favorites      |
| `/api/admin/dashboard`         | GET    | Admin         | Get admin dashboard stats      |
| `/api/upload/single`           | POST   | Yes           | Upload single file             |

---

## 🔒 Security Features

### 1. **Helmet** - HTTP Security Headers
Protects against common web vulnerabilities by setting secure HTTP headers.

### 2. **CORS** - Cross-Origin Resource Sharing
- Configured to allow specific frontend origins
- Supports credentials (cookies, auth headers)
- Automatically allows Vercel preview domains (`*.vercel.app`)
- Blocks unauthorized origins

### 3. **Rate Limiting**
- **Global limit**: 100 requests per 15 minutes per IP
- Prevents brute force attacks and API abuse
- Configurable per route

### 4. **Input Validation**
- **Zod schemas** validate all request bodies
- Prevents invalid data from reaching the database
- Clear error messages for validation failures

### 5. **MongoDB Sanitization**
- Prevents NoSQL injection attacks
- Sanitizes user input before database queries

### 6. **JWT Authentication**
- Stateless authentication with JSON Web Tokens
- Tokens expire after configured time (default: 7 days)
- Secure token signing with secret key

### 7. **Password Hashing**
- Passwords hashed with bcryptjs (10 salt rounds)
- Never store plain-text passwords

### 8. **Database Connection Check**
- Middleware checks DB connection before processing requests
- Returns 503 if database is unavailable

---

## 🔧 Error Handling

### Error Response Format

All errors follow this structure:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "errors": [], // Optional: Validation errors
  "stack": "..." // Only in development
}
```

### Common HTTP Status Codes

| Code | Meaning               | Example                          |
|------|-----------------------|----------------------------------|
| 200  | OK                    | Successful GET request           |
| 201  | Created               | Resource created successfully    |
| 400  | Bad Request           | Validation error                 |
| 401  | Unauthorized          | Missing or invalid token         |
| 403  | Forbidden             | Insufficient permissions         |
| 404  | Not Found             | Resource doesn't exist           |
| 409  | Conflict              | Duplicate entry (e.g., email)    |
| 500  | Internal Server Error | Unexpected server error          |
| 503  | Service Unavailable   | Database connection failed       |

---

## 🧪 Testing

Run tests with Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

**Test structure**:
- Unit tests for services and utilities
- Integration tests for API endpoints
- Database mocking with Jest

---

## 🌐 Deployment

### Deploy to Render

1. **Push code to GitHub**

2. **Create new Web Service on Render**:
   - Connect GitHub repository
   - **Root Directory**: `server/`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Configure environment variables** (all variables from `.env`)

4. **Deploy**

### Deploy to Railway

1. **Push code to GitHub**

2. **Create new project on Railway**:
   - Import GitHub repository
   - Set root directory to `server/`

3. **Configure environment variables**

4. **Deploy**

### Deploy to Heroku

1. **Create Heroku app**:
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-uri
   # ... set all other variables
   ```

3. **Deploy**:
   ```bash
   git push heroku main
   ```

**Note**: The `Procfile` is already configured for Heroku deployment.

---

## ⚠️ Common Issues & Fixes

### Issue 1: Database Connection Failed

**Symptom**: `MongooseError: Failed to connect to MongoDB`

**Fix**:
- Ensure MongoDB is running (local): `mongod` or check system services
- Verify `MONGODB_URI` is correct
- Check network connectivity (for MongoDB Atlas)
- Whitelist IP address in MongoDB Atlas Network Access

### Issue 2: JWT Authentication Error

**Symptom**: `401 Unauthorized` or `jwt malformed`

**Fix**:
- Ensure `JWT_SECRET` is set in `.env`
- Check token is being sent in Authorization header: `Bearer <token>`
- Verify token hasn't expired
- Check frontend is storing and sending token correctly

### Issue 3: CORS Error

**Symptom**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Fix**:
- Add frontend URL to `FRONTEND_URL` in `.env`
- Ensure backend server is running
- Check CORS configuration in `src/app.js`
- Clear browser cache

### Issue 4: File Upload Fails

**Symptom**: Images not uploading or returning errors

**Fix**:
- Check `uploads/` directory exists and has write permissions
- Verify `MAX_FILE_SIZE` isn't exceeded
- Ensure Multer middleware is correctly configured
- Check file type is allowed (jpg, jpeg, png, gif, webp)

### Issue 5: Port Already in Use

**Symptom**: `EADDRINUSE: address already in use :::5000`

**Fix**:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:5000 | xargs kill
```

### Issue 6: Environment Variables Not Loading

**Symptom**: `undefined` when accessing `process.env.VARIABLE_NAME`

**Fix**:
- Ensure `.env` file exists in `server/` directory
- Check file is named `.env` exactly (not `.env.txt`)
- Restart server after changing `.env`
- Verify `dotenv` is configured at top of `index.js`

---

## 📊 Database Models

### User
- `name`, `email`, `password`, `phone`
- `role` (user, admin)
- `favorites` (array of pet IDs)
- `avatar`, `isVerified`

### Pet
- `name`, `species`, `breed`, `age`, `gender`, `size`
- `description`, `location`, `images`
- `status` (available, pending, adopted)
- `healthInfo`, `temperament`

### Adoption
- `user`, `pet`
- `status` (pending, approved, rejected)
- `reason`, `experience`, `housingType`
- `submittedAt`, `processedAt`

### Booking
- `user`, `pet`, `serviceType`
- `date`, `time`, `status`
- `notes`

### Other Models
- BlogPost, SuccessStory, Volunteer, DonationContact, ContactMessage, Surrender, Token

---

## 🎯 Best Practices

1. **Always validate input** with Zod schemas
2. **Use async/await** with try-catch for error handling
3. **Never expose sensitive data** in API responses (passwords, tokens)
4. **Use indexes** on frequently queried fields
5. **Sanitize user input** before database operations
6. **Log errors** for debugging (use proper logging library in production)
7. **Keep controllers thin** - move business logic to services
8. **Use HTTP status codes** appropriately
9. **Document API changes** and maintain versioning

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [JWT Documentation](https://jwt.io)
- [Zod Documentation](https://zod.dev)

---

## 👨‍💻 Contributing

When contributing to the backend:

1. Follow MVC architecture pattern
2. Write tests for new features
3. Validate all inputs with Zod
4. Use meaningful variable and function names
5. Add JSDoc comments for complex functions
6. Run `npm run lint` and `npm run format` before committing

---

**Built with Node.js and Express 🚀**
