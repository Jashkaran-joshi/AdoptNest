# AdoptNest 🐾

**Find your perfect pet companion and give abandoned pets a loving new home.**

AdoptNest is a full-stack web platform designed to streamline the pet adoption process by connecting shelters, volunteers, and potential adopters. The platform provides comprehensive features including pet listings, adoption applications, service bookings, volunteer management, donation handling, blog content management, and administrative tools.

---

## 📸 Demo / Screenshots

(Add demo link and screenshots here)

---

## ✨ Features

### Core Features
- **🐕 Pet Adoption System**: Browse pets with advanced search and filtering (species, breed, age, size, location)
- **📝 Adoption Applications**: Submit and track adoption applications with status updates
- **💝 Favorites System**: Save favorite pets for later viewing
- **📅 Service Booking**: Book pet-related services (grooming, training, vet checkups)
- **🤝 Volunteer Management**: Apply to volunteer and track volunteer applications
- **💰 Donation Management**: Contact forms for donation inquiries and support
- **📖 Blog & Success Stories**: Read adoption success stories and informative blog posts
- **📞 Contact System**: Submit general inquiries and messages

### User Features
- **👤 User Authentication**: Secure signup/login with JWT-based auth
- **🔐 Email Verification**: (Ready for future implementation)
- **🔄 Password Reset**: (Ready for future implementation)
- **📊 User Dashboard**: Manage adoptions, bookings, surrenders, and favorites
- **🔔 Notifications**: Real-time notifications for application status updates
- **🐾 Pet Surrender**: Submit pets for adoption through the platform

### Admin Features
- **🛡️ Admin Dashboard**: Comprehensive admin panel with analytics
- **✅ Application Management**: Review and approve/reject adoption applications
- **🐶 Pet Management**: Add, edit, delete pet listings
- **👥 User Management**: View and manage user accounts
- **📋 Booking Management**: Handle service booking requests
- **📚 Content Management**: Manage blog posts and success stories
- **📊 Analytics**: View platform statistics and insights

### Security & Performance
- **🔒 JWT Authentication**: Secure token-based authentication
- **🛡️ Security Middleware**: Helmet, CORS, rate limiting, mongo-sanitize
- **📤 File Upload**: GitHub CDN integration via jsDelivr for image hosting
- **🔍 Input Validation**: Zod schema validation on all endpoints
- **⚡ Database Indexing**: Optimized queries with MongoDB indexes
- **🌐 CORS & CSP**: Production-ready Cross-Origin Resource Sharing and Content Security Policy

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Router**: React Router DOM 7.9.6
- **Styling**: TailwindCSS 4.0.0 with custom design system
- **HTTP Client**: Axios 1.13.2
- **Language**: JavaScript (ES6+)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.21.2
- **Database**: MongoDB (Mongoose ODM 8.9.2)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **Validation**: Zod 3.24.1
- **File Upload**: Multer 1.4.5-lts.1
- **Security**: Helmet 8.0.0, CORS 2.8.5, express-rate-limit 7.4.1, express-mongo-sanitize 2.2.0
- **Email**: Nodemailer 6.9.16 (for future features)
- **Password Hashing**: bcryptjs 2.4.3

### DevOps & Tools
- **Testing**: Jest 29.7.0
- **Linting**: ESLint 9.39.1
- **Code Formatting**: Prettier 3.6.2
- **Version Control**: Git & GitHub
- **CDN**: jsDelivr (GitHub-based)
- **Environment**: dotenv 16.4.7

---

## 📁 Project Structure

```
AdoptNest/
├── client/                      # React frontend application
│   ├── public/                  # Static assets (favicon, etc.)
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── layout/          # Navbar, Footer
│   │   │   ├── features/        # ProtectedRoute, ScrollToTop, etc.
│   │   │   └── forms/           # Form components
│   │   ├── pages/               # Page components
│   │   │   ├── admin/           # Admin pages
│   │   │   ├── auth/            # Login, Signup, etc.
│   │   │   ├── content/         # Home, Blog, About, FAQ
│   │   │   ├── pets/            # Pet browsing and adoption
│   │   │   ├── user/            # User dashboard
│   │   │   ├── services/        # Service booking
│   │   │   ├── support/         # Contact, Donate, Volunteer
│   │   │   ├── legal/           # Privacy, Terms
│   │   │   └── common/          # NotFound, etc.
│   │   ├── contexts/            # React Context providers (Auth, Theme, etc.)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── services/            # API service layer
│   │   ├── utils/               # Helper functions
│   │   ├── constants/           # App constants
│   │   ├── config/              # Configuration files
│   │   ├── App.jsx              # Main app component with routing
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # TailwindCSS configuration
│   └── .env.example             # Environment variable template
│
├── server/                      # Node.js/Express backend API
│   ├── src/
│   │   ├── controllers/         # Route handlers (business logic)
│   │   ├── models/              # Mongoose models/schemas
│   │   ├── routes/              # API route definitions
│   │   ├── middleware/          # Auth, error handling, etc.
│   │   ├── services/            # Business logic services
│   │   ├── validators/          # Zod validation schemas
│   │   ├── utils/               # Helper functions
│   │   ├── constants/           # Server constants
│   │   ├── config/              # Configuration (database, etc.)
│   │   └── app.js               # Express app configuration
│   ├── scripts/                 # Utility scripts (seeding, etc.)
│   ├── tests/                   # Test files
│   ├── uploads/                 # Local file uploads (development)
│   ├── index.js                 # Server entry point
│   ├── package.json             # Backend dependencies
│   └── .env                     # Environment variables (not committed)
│
├── docs/                        # Comprehensive project documentation
│   ├── authentication/          # Auth flow, JWT, tokens
│   ├── backend/                 # API, controllers, services
│   ├── frontend/                # Components, pages, routing
│   ├── database/                # Models, schemas, setup
│   ├── deployment/              # Production deployment guides
│   ├── features/                # Feature-specific docs
│   └── ...                      # And more
│
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **MongoDB**: Local installation or MongoDB Atlas account
- **Git**: For version control
- **npm**: Comes with Node.js

### Clone the Repository
```bash
git clone https://github.com/Jashkaran-joshi/AdoptNest.git
cd AdoptNest
```

### Install Dependencies

**Install both client and server dependencies:**

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

## ⚙️ Environment Variables

You need to configure environment variables for both the client and server.

### Client Environment Variables

Create `.env.local` in the `client/` directory (copy from `.env.example`):

```env
# Backend API Base URL
VITE_API_BASE=http://localhost:5000/api
```

### Server Environment Variables

Create `.env` in the `server/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/adoptnest
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adoptnest_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRE=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880

# Admin Account (for seeding)
ADMIN_EMAIL=admin@adoptnest.com
ADMIN_PASSWORD=admin123

# GitHub CDN Configuration (Optional - for production image hosting)
GITHUB_REPO_OWNER=your-github-username
GITHUB_REPO_NAME=your-cdn-repo
GITHUB_REPO_BRANCH=main
GITHUB_TOKEN=your-github-token
GITHUB_AUTO_UPLOAD=false

# Email Configuration (Optional - for password reset)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASS=your-app-password
# EMAIL_FROM=AdoptNest <noreply@adoptnest.com>
```

**Important**: Never commit `.env` files to version control.

---

## 💻 Running the Project

### Development Mode

You need to run both the client and server concurrently.

**Terminal 1 - Start the Server:**
```bash
cd server
npm run dev
# Server will run on http://localhost:5000
```

**Terminal 2 - Start the Client:**
```bash
cd client
npm run dev
# Client will run on http://localhost:5173
```

Open your browser and navigate to `http://localhost:5173`

### Production Mode

**Build the Client:**
```bash
cd client
npm run build
# Creates optimized production build in client/dist/
```

**Start the Server:**
```bash
cd server
npm start
# Server runs in production mode
```

---

## 🧪 Seed Development Data

To populate the database with sample data for testing:

```bash
cd server
npm run seed:dev
```

This will create:
- Admin account (admin@adoptnest.com / admin123)
- Sample users
- Sample pet listings
- Blog posts and success stories

---

## 📖 API Overview

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-domain.com/api`

### Authentication
- Most endpoints require JWT authentication
- Include token in Authorization header: `Bearer <token>`

### Available Endpoints

| Route                    | Description                          |
|--------------------------|--------------------------------------|
| `/api/auth/*`            | Authentication (signup, login, etc.) |
| `/api/pets/*`            | Pet listings and details             |
| `/api/adoptions/*`       | Adoption applications                |
| `/api/surrenders/*`      | Pet surrender submissions            |
| `/api/bookings/*`        | Service bookings                     |
| `/api/volunteers/*`      | Volunteer applications               |
| `/api/donation-contact/*`| Donation inquiries                   |
| `/api/contact/*`         | General contact messages             |
| `/api/blog/*`            | Blog posts                           |
| `/api/stories/*`         | Success stories                      |
| `/api/users/*`           | User profile management              |
| `/api/admin/*`           | Admin operations                     |
| `/api/upload/*`          | File upload endpoints                |
| `/api/health`            | Health check endpoint                |

For detailed API documentation, see [docs/backend/apis.md](docs/backend/apis.md)

---

## 🧪 Testing

Run tests for the backend:

```bash
cd server
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
```

---

## 🏗️ Build for Production

### Build Client
```bash
cd client
npm run build
```
Output will be in `client/dist/`

### Server
No build step required for Node.js backend. Configure environment variables for production.

---

## 🌐 Deployment

### Frontend Deployment (Vercel)
1. Push your code to GitHub
2. Connect repository to Vercel
3. Set root directory to `client/`
4. Set environment variable: `VITE_API_BASE=https://your-backend-url.com/api`
5. Deploy

### Backend Deployment (Render/Railway)
1. Push your code to GitHub
2. Connect repository to Render/Railway
3. Set root directory to `server/`
4. Configure all environment variables (see Environment Variables section)
5. Deploy

For detailed deployment instructions, see [docs/deployment/PRODUCTION_SETUP.md](docs/deployment/PRODUCTION_SETUP.md)

---

## 🤝 Contribution Guidelines

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Commit your changes**: `git commit -m "Add some feature"`
4. **Push to the branch**: `git push origin feature/your-feature-name`
5. **Open a Pull Request**

### Code Style
- Follow existing code conventions
- Run ESLint and Prettier before committing
- Write meaningful commit messages
- Add tests for new features

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author & Contact

**GitHub**: [@Jashkaran-joshi](https://github.com/Jashkaran-joshi)

**Repository**: [AdoptNest](https://github.com/Jashkaran-joshi/AdoptNest)

For questions or feedback, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- MongoDB for the database solution
- Vercel for frontend hosting
- Render for backend hosting
- jsDelivr for CDN services
- All open-source libraries and contributors

---

**Made with ❤️ for pets looking for their forever homes** 🐾
