# 📚 AdoptNest - Complete Project Documentation

Welcome to the comprehensive documentation for the AdoptNest pet adoption platform. This documentation system is organized into multiple sections for easy navigation and understanding.

## 📋 Documentation Index

### 🎨 [Frontend Documentation](./frontend/)
- **Structure**: Project organization and file structure
- **Components**: All React components and their usage
- **Pages**: All pages and their routes
- **Routing**: React Router configuration
- **Styling**: Tailwind CSS setup and usage
- **Libraries**: All frontend dependencies
- **Commands**: Frontend development commands

### ⚙️ [Backend Documentation](./backend/)
- **APIs**: Complete API endpoint reference
- **Routes**: All route definitions and middleware
- **Controllers**: Request handling logic
- **Middleware**: Authentication, error handling, validation
- **Models**: Database models and schemas
- **Services**: Business logic layer
- **Error Handling**: Error management system
- **Commands**: Backend development commands

### 🗄️ [Database Documentation](./database/)
- **MongoDB Atlas Setup**: Connection configuration
- **Schemas**: All database schemas
- **Models**: Mongoose model definitions
- **Connection Logic**: Database connection management
- **Indexes**: Database indexes and optimization

### 🔗 [Connections Documentation](./connections/)
- **Frontend-Backend**: How React connects to Express API
- **Backend-Database**: MongoDB Atlas connection setup
- **Environment Variables**: All configuration variables
- **API Integration**: API service layer

### 🔄 [Code Flow Documentation](./code-flow/)
- **Authentication Flow**: Login, signup, password reset
- **Pet Adoption Flow**: Complete adoption process
- **Booking Flow**: Service booking process
- **File Upload Flow**: Image upload system
- **Admin Operations**: Admin dashboard workflows

### 💻 [Commands Documentation](./commands/)
- **Running the Project**: Development and production commands
- **Seeding**: Database seeding commands
- **Building**: Build and deployment commands
- **Testing**: Testing commands
- **Utilities**: Helper scripts

### 🌱 [Seed Data Documentation](./seed-data/)
- **Seeders**: All available seed scripts
- **How to Run**: Step-by-step seeding instructions
- **Expected Output**: What data gets created
- **Test Credentials**: Default login credentials

### 🔐 [Authentication Documentation](./authentication/)
- **Logic**: Authentication implementation
- **Tokens**: JWT token system
- **Middleware**: Auth middleware usage
- **Flows**: Complete authentication flows
- **Default Credentials**: Admin and user login details

### ✨ [Features Documentation](./features/)
- **File Upload**: Image upload system
- **Notifications**: Notification system
- **Favorites**: Favorite pets feature
- **Search & Filters**: Pet search functionality
- **Admin Dashboard**: Admin features
- **User Dashboard**: User features

---

## 🚀 Quick Start

1. **Setup Environment**: See [Connections Documentation](./connections/)
2. **Database Setup**: See [Database Documentation](./database/)
3. **Run Backend**: `cd server && npm start`
4. **Run Frontend**: `cd client && npm run dev`
5. **Seed Data**: See [Seed Data Documentation](./seed-data/)

---

## 📖 How to Use This Documentation

- **New to the project?** Start with [Frontend](./frontend/) and [Backend](./backend/) structure
- **Setting up?** Check [Connections](./connections/) and [Database](./database/)
- **Understanding features?** Read [Code Flow](./code-flow/) and [Features](./features/)
- **Need commands?** See [Commands](./commands/)
- **Testing?** Check [Seed Data](./seed-data/) for test credentials

---

## 🎯 Project Overview

AdoptNest is a full-stack pet adoption platform built with:
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB Atlas
- **Authentication**: JWT tokens
- **Image Storage**: jsDelivr CDN (GitHub-hosted images) with local storage fallback

---

## 📝 Documentation Structure

```
docs/
├── README.md (this file)
├── frontend/
│   ├── structure.md
│   ├── components.md
│   ├── pages.md
│   ├── routing.md
│   ├── styling.md
│   └── libraries.md
├── backend/
│   ├── apis.md
│   ├── routes.md
│   ├── controllers.md
│   ├── middleware.md
│   ├── models.md
│   ├── services.md
│   └── error-handling.md
├── database/
│   ├── setup.md
│   ├── schemas.md
│   ├── models.md
│   ├── connection.md
│   └── indexes.md
├── connections/
│   ├── frontend-backend.md
│   ├── backend-database.md
│   └── environment-variables.md
├── code-flow/
│   ├── authentication.md
│   ├── adoption.md
│   ├── booking.md
│   ├── file-upload.md
│   └── admin-operations.md
├── commands/
│   ├── running.md
│   ├── seeding.md
│   ├── building.md
│   └── testing.md
├── seed-data/
│   ├── seeders.md
│   ├── how-to-run.md
│   └── test-credentials.md
├── authentication/
│   ├── logic.md
│   ├── tokens.md
│   ├── middleware.md
│   └── flows.md
└── features/
    ├── file-upload.md
    ├── notifications.md
    ├── favorites.md
    └── search-filters.md
```

---

## 🔍 Need Help?

- Check the specific documentation section for your question
- Review [Code Flow](./code-flow/) for step-by-step processes
- See [Commands](./commands/) for available commands
- Check [Seed Data](./seed-data/) for test data and credentials

---

**Last Updated**: Documentation generated for AdoptNest v1.0.0

