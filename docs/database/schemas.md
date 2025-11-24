# Database Schemas

## 📊 Schema Overview

All schemas are defined using Mongoose and include timestamps (createdAt, updatedAt).

## 👤 User Schema

**File**: `server/src/models/User.js`

```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed, validated),
  password: String (required, minlength: 6, not selected by default),
  phone: String (trimmed),
  city: String (trimmed),
  role: Enum ['user', 'admin'] (default: 'user'),
  isEmailVerified: Boolean (default: false),
  status: Enum ['active', 'suspended'] (default: 'active'),
  timestamps: true
}
```

**Indexes**: email (unique)

## 🐾 Pet Schema

**File**: `server/src/models/Pet.js`

```javascript
{
  name: String (required, trimmed),
  type: Enum ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'] (required),
  breed: String (trimmed),
  age: Number,
  ageGroup: Enum ['Young', 'Adult', 'Senior'],
  gender: Enum ['Male', 'Female'],
  location: String (trimmed),
  image: String,
  description: String (trimmed),
  status: Enum ['Available', 'Adopted', 'Pending'] (default: 'Available'),
  featured: Boolean (default: false),
  createdBy: ObjectId (ref: 'User'),
  timestamps: true
}
```

**Indexes**: Text index on name, breed, location, description

## 📝 Adoption Schema

**File**: `server/src/models/Adoption.js`

```javascript
{
  petId: ObjectId (ref: 'Pet', required),
  applicantId: ObjectId (ref: 'User', required),
  name: String (required, trimmed),
  email: String (required, trimmed),
  phone: String (required, trimmed),
  address: String (required, trimmed),
  city: String (required, trimmed),
  experience: String (trimmed),
  reason: String (required, trimmed),
  otherPets: Boolean (default: false),
  otherPetsDetails: String (trimmed),
  homeType: Enum ['apartment', 'house', 'condo', 'other'],
  yard: Boolean (default: false),
  hoursAlone: String (required, trimmed),
  references: String (trimmed),
  status: Enum ['Pending', 'Approved', 'Rejected', 'Cancelled'] (default: 'Pending'),
  notes: String (trimmed),
  timestamps: true
}
```

**Indexes**: applicantId, petId, status

## 🏥 Surrender Schema

**File**: `server/src/models/Surrender.js`

```javascript
{
  name: String (required, trimmed),
  type: Enum ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'] (required),
  age: Number,
  reason: String (trimmed),
  image: String,
  contact: String (trimmed),
  phone: String (trimmed),
  submittedBy: ObjectId (ref: 'User'),
  status: Enum ['Pending', 'Received', 'Rejected'] (default: 'Pending'),
  timestamps: true
}
```

**Indexes**: submittedBy, status

## 📅 Booking Schema

**File**: `server/src/models/Booking.js`

```javascript
{
  userId: ObjectId (ref: 'User', required),
  petId: ObjectId (ref: 'Pet'),
  name: String (required, trimmed),
  email: String (required, trimmed),
  phone: String (trimmed),
  service: Enum ['Grooming', 'Vet / Doctor', 'Boarding (per night)', 'Daycare (per day)', 'Training Session'] (required),
  date: Date (required),
  time: String (required),
  qty: Number (default: 1, min: 1),
  notes: String (trimmed),
  amount: Number (required),
  status: Enum ['Pending', 'Confirmed', 'Cancelled', 'Change Requested'] (default: 'Pending'),
  timestamps: true
}
```

**Indexes**: userId, status, date

## 💬 Contact Message Schema

**File**: `server/src/models/ContactMessage.js`

```javascript
{
  name: String (required, trimmed),
  email: String (required, trimmed),
  message: String (required, trimmed),
  status: Enum ['unread', 'read', 'replied'] (default: 'unread'),
  timestamps: true
}
```

**Indexes**: status

## 📖 Success Story Schema

**File**: `server/src/models/SuccessStory.js`

```javascript
{
  petName: String (required, trimmed),
  petType: Enum ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'] (required),
  adopterName: String (required, trimmed),
  location: String (trimmed),
  story: String (required, trimmed),
  image: String,
  adoptedDate: Date,
  rating: Number (min: 1, max: 5, default: 5),
  published: Boolean (default: true),
  timestamps: true
}
```

## 🤝 Volunteer Schema

**File**: `server/src/models/Volunteer.js`

```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  phone: String (trimmed),
  city: String (trimmed),
  type: Enum ['volunteer', 'foster'] (required),
  availability: String (trimmed),
  experience: String (trimmed),
  why: String (trimmed),
  status: Enum ['Pending', 'Approved', 'Rejected'] (default: 'Pending'),
  timestamps: true
}
```

## 💰 Donation Contact Schema

**File**: `server/src/models/DonationContact.js`

```javascript
{
  name: String (required, trimmed),
  email: String (required, unique, lowercase, trimmed),
  phone: String (trimmed),
  purpose: Enum ['general', 'sponsor-pet', 'monthly-support', 'one-time', 'other'] (required),
  message: String (trimmed),
  status: Enum ['new', 'contacted', 'completed', 'archived'] (default: 'new'),
  timestamps: true
}
```

## 📰 Blog Post Schema

**File**: `server/src/models/BlogPost.js`

```javascript
{
  title: String (required, trimmed),
  slug: String (unique, lowercase),
  category: Enum ['Care', 'Health', 'Adoption', 'Behavior', 'Nutrition', 'Training', 'Community', 'Success', 'Policy'],
  author: String (trimmed),
  date: Date,
  readTime: String (trimmed),
  image: String,
  excerpt: String (trimmed),
  content: String (required, trimmed),
  published: Boolean (default: true),
  timestamps: true
}
```

**Indexes**: slug (unique)

## 🔑 Token Schema

**File**: `server/src/models/Token.js`

```javascript
{
  userId: ObjectId (ref: 'User', required),
  token: String (required, unique),
  type: Enum ['email-verification', 'password-reset'] (required),
  expiresAt: Date (required),
  timestamps: true
}
```

**Indexes**: token (unique), userId, expiresAt

## 🔗 Relationships

- **User** → **Pet** (createdBy)
- **User** → **Adoption** (applicantId)
- **User** → **Surrender** (submittedBy)
- **User** → **Booking** (userId)
- **Pet** → **Adoption** (petId)
- **Pet** → **Booking** (petId)
- **User** → **Token** (userId)

---

**Next**: See [Models Documentation](./models.md).

