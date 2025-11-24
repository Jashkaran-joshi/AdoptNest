# Favorites Feature

## ⭐ Favorites Overview

Users can save favorite pets for quick access.

## 🎯 Favorites Context

**Location**: `client/src/contexts/FavoritesContext.jsx`

### Features
- Favorite pets state management
- Add/remove favorites
- Persist to localStorage
- Sync with backend (if implemented)

## 🔄 Favorites Flow

```
User clicks favorite button
  ↓
Frontend: Add to favorites context
  ↓
Save to localStorage
  ↓
(Optional) Sync with backend
  ↓
Update UI (heart icon filled)
```

## 📊 Favorites Storage

### Frontend
- **Location**: `localStorage`
- **Key**: `adoptnest_favorites`
- **Format**: Array of pet IDs

### Backend (Optional)
- Could store in user profile
- Currently frontend-only

## 🎨 UI Components

### Favorite Button
- Heart icon
- Toggle on/off
- Visual feedback

### Favorites Page
- **Route**: `/favorites`
- **Access**: Protected (requires login)
- **Features**: 
  - List of favorite pets
  - Remove from favorites
  - Quick adoption

---

**Next**: See [Search & Filters Feature](./search-filters.md).

