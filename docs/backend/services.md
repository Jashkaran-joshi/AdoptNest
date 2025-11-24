# Backend Services

## 🔧 Service Layer Overview

Services contain business logic, separate from controllers and models.

## 📋 Available Services

### Auth Service
**File**: `services/authService.js`

**Methods**:
- `signup(userData)` - Create user account
- `login(email, password)` - Authenticate user
- `forgotPassword(email)` - Request password reset
- `resetPassword(token, password)` - Reset password
- `verifyEmail(token)` - Verify email address

### Pet Service
**File**: `services/petService.js`

**Methods**:
- `getPets(filters)` - Get pets with filters
- `getPetById(id)` - Get single pet
- `createPet(petData, userId)` - Create pet
- `updatePet(id, petData)` - Update pet
- `deletePet(id)` - Delete pet

### Booking Service
**File**: `services/bookingService.js`

**Methods**:
- `createBooking(bookingData, userId)` - Create booking
- `getBookings(userId, role, filters)` - Get bookings
- `getBookingById(id, userId, role)` - Get single booking
- `updateBooking(id, updateData, userId, role)` - Update booking
- `cancelBooking(id, userId, role)` - Cancel booking
- `calculateAmount(service, qty)` - Calculate booking amount

## 🎯 Service Pattern

### Standard Pattern
```javascript
class Service {
  async method(data) {
    // Business logic
    // Database operations
    // Return result
  }
}

module.exports = new Service();
```

### Service Benefits
- Separation of concerns
- Reusable business logic
- Easier testing
- Cleaner controllers

---

**Next**: See [Error Handling Documentation](./error-handling.md).

