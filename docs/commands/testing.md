# Testing Commands

## 🧪 Backend Testing

### Run Tests
```bash
cd server
npm test
```
- Runs Jest test suite
- Generates coverage report

### Watch Mode
```bash
cd server
npm run test:watch
```
- Watches for file changes
- Re-runs tests automatically

### Test Database Connection
```bash
cd server
npm run test:db
```
- Tests MongoDB Atlas connection
- Verifies data reading/writing

## 🔍 Frontend Testing

### Lint Code
```bash
cd client
npm run lint
```
- Checks code quality
- Reports errors and warnings

### Fix Linting Issues
```bash
cd client
npm run lint -- --fix
```
- Automatically fixes issues

## 📊 Test Coverage

### Backend Coverage
```bash
cd server
npm test -- --coverage
```
- Generates coverage report
- Shows test coverage percentage

## 🎯 Manual Testing

### API Testing
```bash
# Health check
curl http://localhost:5000/api/health

# Test login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@adoptnest.com","password":"admin123"}'
```

### Frontend Testing
- Open browser: `http://localhost:5173`
- Test all features manually
- Check browser console for errors

---

**Next**: Return to [Main Documentation](../README.md).

