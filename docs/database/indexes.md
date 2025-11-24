# Database Indexes

## 📊 Index Overview

Indexes improve query performance and enforce uniqueness.

## 🔍 Available Indexes

### User Model
- **email**: Unique index (enforces unique emails)

### Pet Model
- **Text Index**: On `name`, `breed`, `location`, `description`
  - Enables text search functionality

### Adoption Model
- **applicantId**: Index (for user's adoptions query)
- **petId**: Index (for pet's adoptions query)
- **status**: Index (for status filtering)

### Booking Model
- **userId**: Index (for user's bookings query)
- **status**: Index (for status filtering)
- **date**: Index (for date-based queries)

### Contact Message Model
- **status**: Index (for status filtering)

### Surrender Model
- **submittedBy**: Index (for user's surrenders query)
- **status**: Index (for status filtering)

### Blog Post Model
- **slug**: Unique index (enforces unique slugs)

### Token Model
- **token**: Unique index (enforces unique tokens)
- **userId**: Index (for user's tokens query)
- **expiresAt**: Index (for expiration queries)

## 🎯 Index Benefits

### Performance
- Faster queries on indexed fields
- Efficient sorting and filtering

### Uniqueness
- Unique indexes prevent duplicates
- Enforced at database level

## 📝 Index Usage

### Text Search
```javascript
// Uses text index
Pet.find({ $text: { $search: 'golden retriever' } });
```

### Query Optimization
```javascript
// Uses applicantId index
Adoption.find({ applicantId: userId });
```

---

**Next**: Return to [Main Documentation](../README.md).

