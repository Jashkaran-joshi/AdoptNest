# Frontend-Backend Connection

## 🔗 Connection Overview

The frontend (React) communicates with the backend (Express API) via HTTP requests.

## 🌐 API Base URL

### Configuration

**Frontend** (`client/.env`):
```env
VITE_API_BASE=http://localhost:5000/api
```

**Backend** (`server/.env`):
```env
FRONTEND_URL=http://localhost:5173
```

## 📡 API Service Layer

### Location
`client/src/services/api.js`

### Axios Instance

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 30000
});
```

## 🔄 Request Flow

```
Frontend Component
  ↓
API Service Function (api.js)
  ↓
Axios Request Interceptor
  ↓
Add Authentication Token
  ↓
HTTP Request to Backend
  ↓
Backend Express Server
  ↓
Middleware (CORS, Auth, Validation)
  ↓
Route Handler
  ↓
Controller
  ↓
Service/Model
  ↓
Database (MongoDB Atlas)
  ↓
Response back through chain
  ↓
Axios Response Interceptor
  ↓
Error Handling
  ↓
Frontend Component
```

## 🔐 Authentication Integration

### Token Addition

**Request Interceptor** (`client/src/services/api.js`):
```javascript
api.interceptors.request.use((config) => {
  const user = localStorage.getItem("adoptnest_user");
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});
```

### Token Extraction

**Backend Middleware** (`server/src/middleware/auth.js`):
```javascript
const token = req.headers.authorization.split(' ')[1];
const decoded = jwt.verify(token, config.jwt.secret);
```

## 🌍 CORS Configuration

### Backend CORS Setup

```javascript
const corsOptions = {
  origin: config.frontend.url,  // http://localhost:5173
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

## 📊 API Endpoint Usage

### Example: Fetching Pets

**Frontend**:
```javascript
import { fetchPets } from '../services/api';

const pets = await fetchPets('?type=Dog&page=1');
```

**Backend**:
```javascript
// GET /api/pets?type=Dog&page=1
router.get('/', getPets);
```

## 🚨 Error Handling

### Frontend Error Interceptor

```javascript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 (Unauthorized)
    if (error.response?.status === 401) {
      localStorage.removeItem("adoptnest_user");
      window.location.href = "/login";
    }
    // Return formatted error
    return Promise.reject(error);
  }
);
```

### Backend Error Handler

```javascript
// server/src/middleware/errorHandler.js
app.use(errorHandler);
```

## 📡 Request/Response Format

### Request Format

**Headers**:
```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

**Body** (for POST/PUT):
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Response Format

**Success**:
```json
{
  "success": true,
  "data": { ... }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE"
}
```

## 🔄 Real-time Updates

Currently, the app uses polling for updates. Consider WebSockets for real-time features.

## 🧪 Testing the Connection

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Test from Frontend

```javascript
// In browser console
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(console.log);
```

---

**Next**: See [Backend-Database Connection](./backend-database.md).

