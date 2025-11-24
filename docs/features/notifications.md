# Notifications System

## 🔔 Notification Overview

The application includes a notification system for user alerts and updates.

## 🎯 Notification Context

**Location**: `client/src/contexts/NotificationContext.jsx`

### Features
- Notification state management
- Add/remove notifications
- Notification count
- Notification bell component

## 🔔 Notification Bell

**Component**: `components/features/NotificationBell.jsx`

### Features
- Displays notification count
- Click to view notifications
- Badge indicator

## 📊 Notification Types

### User Notifications
- Adoption status updates
- Booking confirmations
- Account updates

### Admin Notifications
- New adoption applications
- New contact messages
- New volunteer applications

## 🔄 Notification Flow

```
Event occurs (e.g., adoption approved)
  ↓
Backend updates status
  ↓
Frontend fetches updated data
  ↓
Notification context updates
  ↓
Notification bell shows count
  ↓
User clicks bell
  ↓
Notifications displayed
```

## 🎨 Implementation

### Notification Context Usage
```javascript
const { notifications, addNotification } = useNotification();

addNotification({
  type: 'success',
  message: 'Adoption approved!'
});
```

---

**Next**: See [Favorites Feature](./favorites.md).

