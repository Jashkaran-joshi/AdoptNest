# Database Connection

## 🔌 Connection Management

### Connection File
**Location**: `server/src/config/database.js`

### Connection Function
```javascript
const connectDB = async () => {
  // Validate URI
  // Setup listeners
  // Connect to MongoDB
  // Handle errors
};
```

## 🔄 Connection Lifecycle

### 1. Server Startup
```
Server starts
  ↓
index.js calls connectDB()
  ↓
Validate MongoDB URI
  ↓
Check if already connected
  ↓
mongoose.connect(uri, options)
  ↓
Connection established
  ↓
Server starts listening
```

### 2. Connection Events
- **connected**: Logged when connected
- **error**: Logged with error details
- **disconnected**: Attempts reconnection
- **reconnected**: Logged when reconnected

### 3. Reconnection Logic
```
Connection lost
  ↓
disconnected event
  ↓
Check reconnect attempts (< 5)
  ↓
Wait 5 seconds
  ↓
Attempt reconnect
  ↓
Success? → Reset attempts
  ↓
Failed? → Increment attempts
  ↓
Max attempts? → Stop retrying
```

## ✅ Connection Status

### Get Status
```javascript
const status = getConnectionStatus();
// Returns: { isConnected, readyState, host, name }
```

### Health Check
```javascript
GET /api/health
// Returns database connection status
```

## 🔒 Connection Security

### URI Validation
- Must be MongoDB Atlas format (`mongodb+srv://`)
- Validates format before connection
- Throws error if invalid

### Connection Options
- Optimized for cloud MongoDB
- Retry writes enabled
- Connection pooling configured

---

**Next**: See [Indexes Documentation](./indexes.md).

