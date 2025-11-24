# Scripts Directory Overview

This directory contains utility scripts for development and database management.

## Available Scripts

### 🗄️ Database Seeding Script

#### `seed-dev-data.js` ⭐ **Main Seed Script**
**Purpose**: Generates comprehensive test data for development

**What it does**:
- Creates realistic test data with Indian context
- Creates exactly 2 admin users (Jashkaranjoshi@gmail.com and Admin@gmail.com)
- Creates exactly 25 normal users (password: user@123)
- Creates exactly 100 pets with breed-appropriate images
- Generates 50 blog posts with Indian context
- Generates 20 success stories
- Automatically uploads images to GitHub (if `GITHUB_AUTO_UPLOAD=true`)
- Generates jsDelivr CDN URLs for all images
- Populates all database modules with realistic data

**Usage**:
```bash
npm run seed:dev
# or
node scripts/seed-dev-data.js
```

**Environment Variables**:
- `MONGODB_URI` or `MONGODB_URI_DEV` - Database connection string
- `GITHUB_TOKEN` - Personal Access Token (for auto-upload, optional)
- `GITHUB_AUTO_UPLOAD=true` - Enable automatic image uploads (optional)
- `FORCE_SEED=true` - Override database name safety check (use with caution)
- `SEED_VALUE` - Optional seed value for deterministic data generation

**What gets created**:
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

**All data is culturally accurate for India** with:
- Indian names, cities, and locations
- Indian context in descriptions
- Realistic scenarios for Indian households
- Breed-appropriate pet images

---

## Quick Reference

### First Time Setup
```bash
# 1. Ensure MONGODB_URI is set in server/.env
# 2. (Optional) Configure GitHub auto-upload:
#    - Set GITHUB_TOKEN in .env
#    - Set GITHUB_AUTO_UPLOAD=true
#    - See GITHUB_AUTO_UPLOAD_SETUP.md for details
# 3. Seed development data
npm run seed:dev
```

### Regular Development
```bash
# Seed test data (regenerates all data)
npm run seed:dev
```

## Important Notes

⚠️ **Safety Checks**:
- `seed-dev-data.js` requires database name to contain "dev" or "test" (unless `FORCE_SEED=true`)
- Script will clear all existing data before seeding
- Always verify `.env` configuration before running
- Use `FORCE_SEED=true` only when absolutely necessary

🔐 **Security**:
- Never commit `.env` file
- Keep `GITHUB_TOKEN` secure if using auto-upload
- Admin credentials are set in the script (change after first run if needed)

📝 **Environment Variables**:
All scripts require proper `.env` configuration. See `GITHUB_AUTO_UPLOAD_SETUP.md` for GitHub-related setup.

---

## Script Dependencies

The seed script requires:
- Node.js environment
- `.env` file with `MONGODB_URI` configured
- MongoDB Atlas connection (mongodb+srv:// format)
- Required npm packages installed
