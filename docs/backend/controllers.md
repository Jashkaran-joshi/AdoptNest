# Backend Controllers

## 🎮 Controller Overview

Controllers handle HTTP requests and responses. They're located in `server/src/controllers/`.

## 📋 Available Controllers

### Auth Controller
**File**: `authController.js`
- `signup()` - User registration
- `login()` - User login
- `logout()` - User logout
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset
- `verifyEmail()` - Email verification

### Pet Controller
**File**: `petController.js`
- `getPets()` - Get all pets (with filters)
- `getPet()` - Get single pet
- `createPet()` - Create new pet (admin)
- `updatePet()` - Update pet (admin)
- `deletePet()` - Delete pet (admin)

### Adoption Controller
**File**: `adoptionController.js`
- `createAdoption()` - Submit adoption application
- `getAdoptions()` - Get adoptions (user's or all for admin)
- `getAdoption()` - Get single adoption
- `updateAdoptionStatus()` - Update status (admin)

### Surrender Controller
**File**: `surrenderController.js`
- `createSurrender()` - Submit surrender request
- `getSurrenders()` - Get surrenders
- `getSurrender()` - Get single surrender
- `updateSurrenderStatus()` - Update status (admin)

### Booking Controller
**File**: `bookingController.js`
- `createBooking()` - Create booking
- `getBookings()` - Get bookings
- `getBooking()` - Get single booking
- `updateBooking()` - Update booking
- `cancelBooking()` - Cancel booking

### Contact Controller
**File**: `contactController.js`
- `submitContact()` - Submit contact form
- `getContactMessages()` - Get messages (admin)
- `markMessageRead()` - Mark as read (admin)

### User Controller
**File**: `userController.js`
- `getProfile()` - Get user profile
- `updateProfile()` - Update user profile

### Admin Controller
**File**: `adminController.js`
- `getStats()` - Get admin statistics
- `getUsers()` - Get all users
- `updateUser()` - Update user (role, status)

### Success Story Controller
**File**: `successStoryController.js`
- `getStories()` - Get success stories
- `getStory()` - Get single story
- `createStory()` - Create story (admin)
- `updateStory()` - Update story (admin)
- `deleteStory()` - Delete story (admin)

### Volunteer Controller
**File**: `volunteerController.js`
- `createVolunteer()` - Submit volunteer application
- `getVolunteers()` - Get volunteers (admin)
- `getVolunteer()` - Get single volunteer (admin)
- `updateVolunteer()` - Update volunteer (admin)
- `deleteVolunteer()` - Delete volunteer (admin)

### Donation Contact Controller
**File**: `donationContactController.js`
- `createDonationContact()` - Submit donation contact
- `getDonationContacts()` - Get contacts (admin)
- `getDonationContact()` - Get single contact (admin)
- `updateDonationContact()` - Update contact (admin)
- `deleteDonationContact()` - Delete contact (admin)

### Blog Controller
**File**: `blogController.js`
- `getBlogPosts()` - Get blog posts
- `getBlogPost()` - Get single blog post
- `createBlogPost()` - Create post (admin)
- `updateBlogPost()` - Update post (admin)
- `deleteBlogPost()` - Delete post (admin)

### Upload Controller
**File**: `uploadController.js`
- Handles file uploads
- Image processing

## 🔄 Controller Pattern

### Standard Pattern
```javascript
exports.controllerFunction = async (req, res, next) => {
  try {
    // Business logic
    const result = await service.method(req.body);
    
    // Success response
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    // Error handling
    next(error);
  }
};
```

### Error Handling
- Controllers use `next(error)` to pass errors to error handler
- Error handler formats and sends response

---

**Next**: See [Middleware Documentation](./middleware.md).

