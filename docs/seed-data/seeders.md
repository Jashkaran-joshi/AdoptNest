# Seeders Overview

## 🌱 Available Seeders

### Development Data Seeder
**File**: `server/scripts/seed-dev-data.js`
**Command**: `npm run seed:dev`

**Features**:
- Generates comprehensive test data with Indian context
- Creates exactly 2 admin users with specified credentials
- Creates exactly 25 normal users
- Creates exactly 100 pets with breed-appropriate images
- Generates 50 blog posts with Indian context
- Automatically uploads images to GitHub (if configured)
- Creates realistic relationships between data

**Data Generated**:
- **2 Admin Users** (exactly)
  - Jashkaranjoshi@gmail.com / 123456
  - Admin@gmail.com / admin@123
- **25 Normal Users** (exactly, password: user@123)
- **100 Pets** (exactly, with breed-appropriate images)
- **25 Adoption Requests**
- **10 Surrenders**
- **20 Bookings**
- **20 Success Stories** (with images)
- **10 Volunteers**
- **60 Donation Contacts**
- **50 Blog Posts** (with images, Indian context)
- **200 Contact Messages**

All data is culturally accurate for India with Indian names, cities, locations, and contexts.

## 🔧 Seeder Configuration

### Environment Variables

```env
# MongoDB connection (required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# GitHub auto-upload (optional)
GITHUB_TOKEN=your_github_token
GITHUB_AUTO_UPLOAD=true

# Force seed (bypass safety checks - use with caution)
FORCE_SEED=true

# Seed value for deterministic generation (optional)
SEED_VALUE=your_seed_value
```

## 🚀 Running Seeders

### Development Seeder
```bash
cd server
npm run seed:dev
```

## ⚠️ Safety Features

### Database Name Check
- Only seeds databases with "dev" or "test" in name
- Prevents accidental production seeding
- Can be overridden with `FORCE_SEED=true`

### Data Clearing
- Development seeder clears all existing data
- Ensures clean test environment

## 📊 Expected Output

```
✅ Inserted 27 users (2 admins, 25 normal users)
✅ Inserted 100 pets
✅ Inserted 25 adoption requests
✅ Inserted 10 surrenders
✅ Inserted 20 bookings
✅ Inserted 20 success stories
✅ Inserted 10 volunteers
✅ Inserted 60 donation contacts
✅ Inserted 50 blog posts
✅ Inserted 200 contact messages
```

---

**Next**: See [How to Run Seeders](./how-to-run.md).
