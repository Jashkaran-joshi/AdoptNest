# Test Credentials

## 🔐 Default Login Credentials

### Admin Accounts (After Seeding)

1. **Email**: `Jashkaranjoshi@gmail.com`
   - **Password**: `123456`
   - **Role**: `admin`

2. **Email**: `Admin@gmail.com`
   - **Password**: `admin@123`
   - **Role**: `admin`

### Regular Users (After Seeding)
After running seed script, all generated users have:
- **Password**: `user@123` (for all 25 users)
- **Email**: Any email from the seeded users list (generated with Indian names)
- **Role**: `user`

## 📊 Seeded Data Summary

When you run `npm run seed:dev`, the following data is created:

### Users (27 total)
- **2 Admin users** (exactly)
  - Jashkaranjoshi@gmail.com / 123456
  - Admin@gmail.com / admin@123
- **25 Regular users** (exactly)
  - Password: `user@123` for all
  - Generated with Indian names and contexts

### Pets (100 total)
- Mixed types: Dogs, Cats, Birds, Rabbits, etc.
- Various ages and statuses
- With breed-appropriate images (jsDelivr CDN URLs or placeholders)

### Adoption Requests (25 total)
- Linked to pets and users
- Various statuses: Pending, Approved, Rejected

### Surrenders (10 total)
- Pet surrender requests
- Linked to users

### Bookings (20 total)
- Service bookings
- Various services and dates

### Success Stories (20 total)
- Adoption success stories
- With images (jsDelivr CDN URLs or placeholders)

### Volunteers (10 total)
- Volunteer applications
- Mixed types: volunteer and foster

### Donation Contacts (60 total)
- Donation inquiries
- Various purposes

### Blog Posts (50 total)
- Blog articles with Indian context
- With images (jsDelivr CDN URLs or placeholders)

### Contact Messages (200 total)
- Contact form submissions
- Various statuses

## 🔍 Finding Test Users

### Method 1: Check Database
Connect to MongoDB Atlas and query users collection:
```javascript
db.users.find({ role: 'admin' })
db.users.find({ role: 'user' }).limit(10)
```

### Method 2: Use Seed Script Output
The seed script logs all created users with their emails.

## 🎯 Testing Scenarios

### Test Admin Access
1. Login with admin credentials
2. Access `/admin` routes
3. Test admin operations

### Test User Access
1. Login with any seeded user email (generated with Indian names)
2. Password: `user@123` (for all 25 users)
3. Test user operations

### Test Public Access
1. Browse pets without login
2. View blog posts
3. Submit contact form

## ⚠️ Important Notes

- **Development Only**: These credentials are for development/testing only
- **Change in Production**: Always change default passwords in production
- **Security**: Never commit real credentials to version control

---

**Next**: See [How to Run Seeders](./how-to-run.md).

