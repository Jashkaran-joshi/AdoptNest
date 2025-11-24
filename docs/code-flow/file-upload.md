# File Upload Code Flow

## 📤 Complete Upload Process

### Current Implementation: jsDelivr CDN (GitHub-hosted)

**Note**: Current implementation uses jsDelivr CDN for image storage. Images must be uploaded to GitHub repository manually, then referenced via jsDelivr URLs.

### Step 1: Image URL Input
```
User provides image URL or path
  ↓
Frontend: Image URL input field
  ↓
User enters:
  - jsDelivr URL (https://cdn.jsdelivr.net/gh/...)
  - GitHub raw URL (https://raw.githubusercontent.com/...)
  - Relative path (pets/dog.jpg)
  ↓
Frontend validates URL format
```

### Step 2: Submit with Image URL
```
Frontend: POST /api/pets (or other endpoint)
  Body: JSON with image URL
  Headers: Content-Type: application/json
  ↓
Backend: Validation middleware
  ↓
Controller receives image URL
```

### Step 3: Process Image URL
```
Controller: createPet()
  ↓
Check if image URL provided
  ↓
Image Manager: getImageUrl()
  ↓
  If jsDelivr URL: Use as-is
  If GitHub URL: Convert to jsDelivr
  If relative path: Generate jsDelivr URL
  If local path: Use local path
  ↓
Add image URL to petData
  ↓
Service: createPet(petData)
  ↓
Database: Pet.create(petData)
  ↓
Return: Pet object with image URL
```

### Step 4: Display Image
```
Frontend requests image
  ↓
URL: jsDelivr CDN URL or local path
  ↓
If jsDelivr: Served from CDN
If local: Express serves from uploads/
  ↓
Image displayed in browser
```

## 🗂️ File Organization

### GitHub Repository Structure
```
repository/
  ├── pets/
  │   ├── dog-123.jpg
  │   └── cat-456.jpg
  ├── stories/
  │   └── story-789.jpg
  ├── blog/
  │   └── post-012.jpg
  └── surrenders/
      └── surrender-345.jpg
```

### jsDelivr URL Format
```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{category}/{filename}
Example: https://cdn.jsdelivr.net/gh/username/adoptnest@main/pets/dog-123.jpg
```

### Local Storage (Fallback)
```
server/uploads/
  ├── pets/
  ├── stories/
  ├── blog/
  ├── surrenders/
  └── users/
```

## 🔄 Image URL Processing Flow

### Backend Image URL Generation
```
Input: Image path or URL
  ↓
Check if full URL (http/https)
  ↓
  Yes → Return as-is (jsDelivr/GitHub/other)
  ↓
  No → Check GitHub config
  ↓
    Configured → Generate jsDelivr URL
    Not configured → Return local path
  ↓
Output: Full image URL
```

### Frontend Image URL Resolution
```
Input: Image path from database
  ↓
Check if full URL (http/https)
  ↓
  Yes → Use directly
  ↓
  No → Try jsDelivr conversion
  ↓
    Success → Use jsDelivr URL
    Fail → Construct API URL
  ↓
Output: Full image URL for <img> tag
```

## 🔒 Security

### File Validation
- URL format validation
- Image type check (if validating)
- URL sanitization

### Access Control
- Image URL input requires authentication
- Admin-only for pets, stories, blog
- User can provide surrender image URLs

### CDN Security
- jsDelivr URLs are public (CDN)
- GitHub repository access controls apply
- Local storage files served via Express static middleware

## 📝 Alternative: Direct File Upload (Future)

If direct file upload is implemented:

### Step 1: User Selects File
```
User selects image file
  ↓
Frontend: File input onChange
  ↓
File object created
  ↓
Optional: Preview image
```

### Step 2: Upload to Storage
```
Frontend: POST /api/upload
  Body: FormData with file
  ↓
Backend: Multer middleware
  ↓
  Extract file from request
  ↓
  Upload to storage (GitHub repository for jsDelivr CDN)
  ↓
  Return storage URL
  ↓
Frontend receives image URL
```

### Step 3: Use Image URL
```
Frontend: POST /api/pets
  Body: JSON with image URL from upload
  ↓
Backend processes as above
```

---

**Next**: See [Admin Operations Flow](./admin-operations.md).

