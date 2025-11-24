# Database Models

## 📦 Model Overview

All models are Mongoose schemas located in `server/src/models/`.

## 📋 Available Models

### User Model
- **File**: `User.js`
- **Collection**: `users`
- **Purpose**: User accounts and authentication
- **Key Methods**: `matchPassword()`, `getSignedJwtToken()`

### Pet Model
- **File**: `Pet.js`
- **Collection**: `pets`
- **Purpose**: Pet listings
- **Indexes**: Text search on name, breed, location, description

### Adoption Model
- **File**: `Adoption.js`
- **Collection**: `adoptions`
- **Purpose**: Adoption applications
- **Relationships**: Links to Pet and User

### Surrender Model
- **File**: `Surrender.js`
- **Collection**: `surrenders`
- **Purpose**: Pet surrender requests
- **Relationships**: Links to User (submittedBy)

### Booking Model
- **File**: `Booking.js`
- **Collection**: `bookings`
- **Purpose**: Service bookings
- **Relationships**: Links to User and Pet

### Contact Message Model
- **File**: `ContactMessage.js`
- **Collection**: `contactmessages`
- **Purpose**: Contact form submissions

### Success Story Model
- **File**: `SuccessStory.js`
- **Collection**: `successstories`
- **Purpose**: Adoption success stories

### Volunteer Model
- **File**: `Volunteer.js`
- **Collection**: `volunteers`
- **Purpose**: Volunteer applications

### Donation Contact Model
- **File**: `DonationContact.js`
- **Collection**: `donationcontacts`
- **Purpose**: Donation inquiries

### Blog Post Model
- **File**: `BlogPost.js`
- **Collection**: `blogposts`
- **Purpose**: Blog articles
- **Indexes**: Unique slug

### Token Model
- **File**: `Token.js`
- **Collection**: `tokens`
- **Purpose**: Email verification and password reset tokens
- **Indexes**: Unique token, expiresAt

## 🔗 Model Relationships

### User Relationships
- Has many Pets (createdBy)
- Has many Adoptions (applicantId)
- Has many Surrenders (submittedBy)
- Has many Bookings (userId)
- Has many Tokens (userId)

### Pet Relationships
- Belongs to User (createdBy)
- Has many Adoptions (petId)
- Has many Bookings (petId)

## 📊 Model Usage

### Creating Documents
```javascript
const user = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123'
});
```

### Querying Documents
```javascript
const pets = await Pet.find({ status: 'Available' });
const user = await User.findById(userId);
```

### Updating Documents
```javascript
await Pet.findByIdAndUpdate(id, { status: 'Adopted' });
```

### Deleting Documents
```javascript
await Pet.findByIdAndDelete(id);
```

## 🔍 Model Methods

### User Methods
- `matchPassword(password)`: Verify password
- `getSignedJwtToken()`: Generate JWT token

### Pre-save Hooks
- **User**: Hashes password before saving

---

**Next**: See [Connection Documentation](./connection.md).

