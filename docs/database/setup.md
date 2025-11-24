# Database Setup - MongoDB Atlas

## 🗄️ Database Overview

The application uses **MongoDB Atlas** (cloud database). Local MongoDB is not supported.

## 📋 Prerequisites

1. MongoDB Atlas account ([Sign up](https://www.mongodb.com/cloud/atlas/register))
2. A cluster created in MongoDB Atlas
3. Network access configured
4. Database user created

## 🚀 Setup Steps

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account
3. Create a free cluster (M0 - Free tier)

### Step 2: Configure Network Access

1. Go to **Network Access** in MongoDB Atlas
2. Click **"Add IP Address"**
3. For development: Add `0.0.0.0/0` (allows all IPs - **not recommended for production**)
4. For production: Add your specific IP addresses
5. Wait 1-2 minutes for changes to propagate

### Step 3: Create Database User

1. Go to **Database Access** in MongoDB Atlas
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Set username and password (save these!)
5. Select **"Atlas admin"** or **"Read and write to any database"** role
6. Click **"Add User"**

### Step 4: Get Connection String

1. Go to your cluster in MongoDB Atlas
2. Click **"Connect"** button
3. Choose **"Connect your application"**
4. Select **"Node.js"** as the driver
5. Copy the connection string

### Step 5: Update .env File

Edit `server/.env`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adoptnest_db?retryWrites=true&w=majority
```

**Important**:
- Replace `username` with your database username
- Replace `password` with your database password
- Replace `cluster.mongodb.net` with your actual cluster address
- Replace `adoptnest_db` with your preferred database name
- Keep `?retryWrites=true&w=majority` at the end

### Step 6: Test Connection

```bash
cd server
npm run test:db
```

## 🔧 Connection Configuration

### Connection Options

Located in `server/src/config/database.js`:

```javascript
{
  serverSelectionTimeoutMS: 30000,  // 30 seconds
  socketTimeoutMS: 45000,           // 45 seconds
  connectTimeoutMS: 30000,          // 30 seconds
  retryWrites: true,                // Enable retryable writes
  retryReads: true,                 // Enable retryable reads
  maxPoolSize: 10,                  // Max connections
  minPoolSize: 5,                   // Min connections
  maxIdleTimeMS: 30000              // Idle timeout
}
```

## ✅ Verification

### Check Connection Status

```bash
# Via API
curl http://localhost:5000/api/health

# Via script
cd server
npm run test:db
```

### Expected Response

```json
{
  "success": true,
  "database": {
    "status": "connected",
    "isConnected": true,
    "host": "cluster0.xxxxx.mongodb.net",
    "name": "adoptnest_db"
  }
}
```

## 🐛 Troubleshooting

### Connection Errors

**Error**: `MongoServerSelectionError`
- **Solution**: Check IP whitelist in Network Access

**Error**: `MongoAuthenticationError`
- **Solution**: Verify username and password

**Error**: `MongoNetworkError`
- **Solution**: Check internet connection and firewall

### Password Special Characters

If password contains `@`, `#`, `%`, etc., URL-encode them:
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`

## 📊 Database Structure

### Collections

- `users` - User accounts
- `pets` - Pet listings
- `adoptions` - Adoption applications
- `surrenders` - Pet surrender requests
- `bookings` - Service bookings
- `contactmessages` - Contact form submissions
- `successstories` - Success stories
- `volunteers` - Volunteer applications
- `donationcontacts` - Donation contacts
- `blogposts` - Blog posts
- `tokens` - Email verification and password reset tokens

## 🔒 Security Best Practices

1. **Never commit** `.env` file to version control
2. **Use strong passwords** for database users
3. **Restrict IP access** in production
4. **Use read-only users** for reporting
5. **Enable MongoDB Atlas** security features

---

**Next**: See [Schemas Documentation](./schemas.md).

