# Frontend Libraries

## 📦 Core Dependencies

### React 19.2.0
- **Purpose**: UI library
- **Usage**: Component-based UI development
- **Key Features**: 
  - Hooks (useState, useEffect, useContext)
  - Context API
  - Component lifecycle

### React DOM 19.2.0
- **Purpose**: React renderer for web
- **Usage**: Rendering React components to DOM

### React Router DOM 7.9.6
- **Purpose**: Client-side routing
- **Usage**: 
  - Route definition
  - Navigation
  - Route protection
- **Key Components**: 
  - `BrowserRouter`
  - `Routes`, `Route`
  - `Link`, `Navigate`
  - `useNavigate`, `useParams`

### Axios 1.13.2
- **Purpose**: HTTP client
- **Usage**: API requests
- **Features**: 
  - Request/response interceptors
  - Automatic JSON parsing
  - Error handling
  - Timeout configuration

## 🎨 Styling Libraries

### Tailwind CSS 4.0.0
- **Purpose**: Utility-first CSS framework
- **Usage**: Styling components
- **Features**: 
  - Utility classes
  - Responsive design
  - Custom theme
  - Dark mode support

### PostCSS 8.5.6
- **Purpose**: CSS processing
- **Usage**: Tailwind CSS processing

### Autoprefixer 10.4.22
- **Purpose**: CSS vendor prefixing
- **Usage**: Automatic browser prefixing

## 🛠️ Build Tools

### Vite 7.2.2
- **Purpose**: Build tool and dev server
- **Usage**: 
  - Development server
  - Hot module replacement
  - Production builds
- **Features**: 
  - Fast HMR
  - Optimized builds
  - Plugin system

### Vite React Plugin 5.1.0
- **Purpose**: React support for Vite
- **Usage**: React compilation

## 🔧 Development Dependencies

### ESLint 9.39.1
- **Purpose**: Code linting
- **Usage**: Code quality checks
- **Plugins**: 
  - React hooks
  - React refresh

### TypeScript Types
- **@types/react**: React type definitions
- **@types/react-dom**: React DOM type definitions

### Babel Plugin React Compiler 1.0.0
- **Purpose**: React compiler optimization
- **Usage**: Automatic React optimizations

## 📚 Library Usage Examples

### React Router
```jsx
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
```

### Axios
```jsx
import axios from 'axios';
const api = axios.create({ baseURL: '...' });
```

### React Context
```jsx
import { createContext, useContext } from 'react';
const AuthContext = createContext();
```

## 🔄 Library Integration

### API Service Layer
- Uses Axios for HTTP requests
- Interceptors for auth tokens
- Error handling

### Routing
- React Router for navigation
- Protected routes
- Dynamic routes

### State Management
- React Context for global state
- Local state with useState
- Effects with useEffect

## 📦 Package Management

### Installation
```bash
npm install
```

### Adding Dependencies
```bash
npm install package-name
```

### Updating Dependencies
```bash
npm update
```

## 🎯 Key Library Patterns

### Axios Instance
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 30000
});
```

### React Context
```javascript
const Context = createContext();
export const Provider = ({ children }) => {
  const [state, setState] = useState();
  return <Context.Provider value={{ state }}>{children}</Context.Provider>;
};
```

### React Router
```javascript
<Routes>
  <Route path="/" element={<Home />} />
</Routes>
```

---

**Next**: See [Commands Documentation](../commands/running.md) for development commands.

