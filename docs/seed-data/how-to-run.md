# How to Run Seeders

## 🌱 Seeding Overview

The seed script populates the database with comprehensive test data for development and testing, all with Indian context.

## 📋 Available Seeder

### Development Data Seeder
**Command**: `npm run seed:dev`
**File**: `server/scripts/seed-dev-data.js`

**What it does**:
- Clears all existing data
- Generates realistic test data with Indian context:
  - **2 Admin Users** (exactly)
    - Jashkaranjoshi@gmail.com / 123456
    - Admin@gmail.com / admin@123
  - **25 Normal Users** (exactly, password: user@123)
  - **100 Pets** (exactly, with breed-appropriate images)
  - **25 Adoption Requests**
  - **10 Surrenders**
  - **20 Bookings**
  - **20 Success Stories**
  - **10 Volunteers**
  - **60 Donation Contacts**
  - **50 Blog Posts** (with Indian context)
  - **200 Contact Messages**

**Usage**:
```bash
cd server
npm run seed:dev
```

## 🚀 Quick Start Seeding

### Step 1: Ensure Database is Connected
Ensure your `server/.env` file has `MONGODB_URI` configured:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### Step 2: (Optional) Configure GitHub Auto-Upload
If you want images to be automatically uploaded to GitHub:
```env
GITHUB_TOKEN=your_github_personal_access_token
GITHUB_AUTO_UPLOAD=true
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo_name
GITHUB_REPO_BRANCH=main
```

See `GITHUB_AUTO_UPLOAD_SETUP.md` for detailed instructions.

### Step 3: Run Development Seeder
```bash
npm run seed:dev
```

### Step 4: Verify Data
- Check MongoDB Atlas dashboard
- Or use API endpoints to fetch data
- Login with admin credentials to test

## ⚙️ Configuration

### Environment Variables
Create or update `server/.env`:

```env
# MongoDB Atlas connection (required)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# GitHub auto-upload (optional)
GITHUB_TOKEN=your_github_token
GITHUB_AUTO_UPLOAD=true
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo_name
GITHUB_REPO_BRANCH=main

# Force seed (bypass safety checks - use with caution)
FORCE_SEED=true

# Seed value for deterministic data generation (optional)
SEED_VALUE=your_seed_value
```

## 🔒 Safety Features

### Development Database Check
The seed script checks if database name contains "dev" or "test":
- ✅ `adoptnest_dev` - Allowed
- ✅ `adoptnest_test` - Allowed
- ⚠️ `adoptnest_prod` - Blocked (unless FORCE_SEED=true)

### Override Safety Check
```bash
FORCE_SEED=true npm run seed:dev
```

**⚠️ Warning**: Only use FORCE_SEED=true when you're absolutely sure you're not seeding a production database!

## 📊 Expected Output

After running `npm run seed:dev`, you should see:

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

## 🎯 Test Credentials

After seeding, use these credentials:

**Admin Users**:
1. Email: `Jashkaranjoshi@gmail.com`
   Password: `123456`

2. Email: `Admin@gmail.com`
   Password: `admin@123`

**Normal Users**:
- Email: Any from seeded users (generated with Indian names)
- Password: `user@123` (for all 25 users)

## 🔄 Re-seeding

To clear and re-seed:
```bash
npm run seed:dev
```

The script automatically clears existing data before seeding.

## ⚠️ Important Notes

1. **Development Only**: Seeders are for development/testing only
2. **Data Loss**: Running seeders clears ALL existing data
3. **Production**: Never run seeders on production database
4. **Images**: If GitHub auto-upload is enabled, images will be uploaded automatically. Otherwise, placeholder URLs are used.
5. **Indian Context**: All generated data is culturally accurate for India

## 📝 Features

- **Deterministic Generation**: Set `SEED_VALUE` in `.env` to generate the same data every time
- **Breed-Appropriate Images**: Pet images match their breeds
- **Indian Context**: All content, names, cities, and descriptions are India-specific
- **Comprehensive Data**: Covers all database modules with realistic relationships

---

**Next**: See [Test Credentials](./test-credentials.md).
