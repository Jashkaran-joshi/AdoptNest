# Backend-Database Connection

## 🔗 Connection Overview

The backend connects to MongoDB Atlas using Mongoose ODM.

## ⚙️ Connection Configuration

### Configuration File
**Location**: `server/src/config/database.js`

### Connection Options
```javascript
{
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  retryWrites: true,
  retryReads: true,
  maxPoolSize: 10,
  minPoolSize: 5,
  maxIdleTimeMS: 30000
}
```

## 🔌 Connection Process

### Initialization
**Location**: `server/index.js`

```javascript
await connectDB();  // Connect before starting server
```

### Connection Flow
```
Server starts
  ↓
connectDB() called
  ↓
Validate MongoDB URI
  ↓
Check if already connected
  ↓
mongoose.connect(uri, options)
  ↓
Setup event listeners
  ↓
Connection established
  ↓
Server starts listening
```

## 📡 Connection Events

### Event Listeners
- **connected**: Connection established
- **error**: Connection error
- **disconnected**: Connection lost
- **reconnected**: Reconnection successful
- **timeout**: Connection timeout

### Event Handling
```javascript
db.on('connected', () => {
  console.log('✅ MongoDB connected');
});

db.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});
```

## 🔄 Reconnection Logic

### Automatic Reconnection
- **Max Attempts**: 5
- **Interval**: 5 seconds
- **Retry**: Automatic on disconnect

### Reconnection Flow
```
Connection lost
  ↓
disconnected event
  ↓
Check reconnect attempts
  ↓
Attempts < 5? → Retry connection
  ↓
Wait 5 seconds
  ↓
Reconnect
  ↓
Success? → Reset attempts
  ↓
Failed? → Increment attempts
```

## ✅ Connection Validation

### URI Validation
```javascript
// Must be MongoDB Atlas (mongodb+srv://)
if (!uri.startsWith('mongodb+srv://')) {
  throw new Error('MongoDB Atlas required');
}
```

### Connection Status
```javascript
const status = getConnectionStatus();
// Returns: isConnected, readyState, host, name
```

## 🧪 Testing Connection

### Health Check Endpoint
```bash
GET /api/health
```

### Diagnostic Script
```bash
npm run test:db
```

## 🔒 Security

### Connection String
- Stored in `.env` file
- Never committed to version control
- Must use MongoDB Atlas format

### Network Access
- IP whitelisting required
- Configured in MongoDB Atlas dashboard

---

**Next**: Return to [Main Documentation](../README.md).

