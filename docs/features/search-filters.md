# Search & Filters

## 🔍 Search Overview

The application provides search and filtering for pets.

## 🎯 Pet Search

### Search Features
- **Text Search**: Search by name, breed, location, description
- **Type Filter**: Filter by pet type (Dog, Cat, Bird, etc.)
- **Age Filter**: Filter by age group (Young, Adult, Senior)
- **Location Filter**: Filter by location
- **Status Filter**: Filter by availability status

## 🔧 Implementation

### Backend Search
**Location**: `server/src/services/petService.js`

```javascript
// Text search
if (search) {
  query.$text = { $search: search };
}

// Type filter
if (type && type !== 'All') {
  query.type = type;
}

// Age filter
if (age && age !== 'Any') {
  query.ageGroup = age;
}
```

### Frontend Filters
**Component**: `components/ui/FiltersBar.jsx`

### Filter Options
- Pet Type: All, Dog, Cat, Bird, Rabbit, Other
- Age Group: Any, Young, Adult, Senior
- Location: Text input
- Status: Available, Adopted, Pending

## 📊 Search Indexes

### Text Index
**Location**: `server/src/models/Pet.js`

```javascript
PetSchema.index({ 
  name: 'text', 
  breed: 'text', 
  location: 'text', 
  description: 'text' 
});
```

## 🔄 Search Flow

```
User enters search/filter
  ↓
Frontend updates query params
  ↓
API request with query string
  ↓
Backend processes filters
  ↓
Database query with filters
  ↓
Return filtered results
  ↓
Frontend displays results
```

## 📝 Usage Examples

### Search Query
```
GET /api/pets?search=golden&type=Dog&age=Young
```

### Filter Query
```
GET /api/pets?type=Cat&location=Mumbai&status=Available
```

---

**Next**: Return to [Main Documentation](../README.md).

