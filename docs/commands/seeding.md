# Seeding Commands

## 🌱 Available Commands

### Development Data Seeder
```bash
cd server
npm run seed:dev
```
- Generates comprehensive test data
- Clears existing data
- Downloads images

### Basic Pet Seeder
```bash
cd server
npm run seed
```
- Seeds basic pet data
- Requires admin user

### Admin Seeder
```bash
cd server
npm run seed:admin
```
- Creates default admin user

## ⚙️ Configuration

### Customize Quantities
```bash
SEED_USERS=100 SEED_PETS=200 npm run seed:dev
```

### Force Seed (Bypass Safety)
```bash
FORCE_SEED=true npm run seed:dev
```

## 📋 Prerequisites

1. MongoDB Atlas connected
2. `.env` file configured
3. Database accessible

## ✅ Verification

After seeding, verify data:
```bash
# Check health
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@adoptnest.com","password":"admin123"}'
```

---

**Next**: See [Building Commands](./building.md).

