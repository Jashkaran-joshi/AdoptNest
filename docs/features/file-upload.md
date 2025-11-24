# File Upload System

## 📤 Upload Overview

The application handles file uploads for:
- Pet images
- Success story images
- Blog post images
- Surrender pet images

## 🛠️ Implementation

### Image Storage System

**Primary**: jsDelivr CDN (GitHub-hosted images)
- Images are stored in GitHub repository
- Served via jsDelivr CDN for fast global delivery
- Format: `https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{path}`

**Fallback**: Local storage
- For development or when GitHub is not configured
- Files stored in `server/uploads/` directory
- Served via Express static middleware

### Backend Configuration

**Location**: `server/src/config/upload.js`

**Multer Setup** (Memory Storage):
```javascript
const multer = require('multer');
// Uses memory storage for cloud uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    // Validate image types only
  }
});
```

**Note**: Current implementation uses memory storage. Images must be uploaded to GitHub manually, then referenced via jsDelivr URLs.

### Upload Categories

Files are organized by category:
- `pets/` - Pet images
- `stories/` - Success story images
- `blog/` - Blog post images
- `surrenders/` - Surrender pet images
- `users/` - User profile images
- `general/` - Miscellaneous uploads

### Image URL Generation

**jsDelivr Service** (`server/src/services/jsdelivrService.js`):
```javascript
const { getJsDelivrUrl } = require('../services/jsdelivrService');

// Generate jsDelivr CDN URL
const imageUrl = getJsDelivrUrl('pets/dog.jpg', 'pets');
// Returns: https://cdn.jsdelivr.net/gh/{owner}/{repo}@main/pets/dog.jpg
```

**Image Manager** (`server/src/utils/imageManager.js`):
```javascript
const { getImageUrl } = require('../utils/imageManager');

// Automatically handles jsDelivr, GitHub, or local paths
const url = getImageUrl('pets', 'dog.jpg');
// Returns jsDelivr URL if configured, otherwise local path
```

### Frontend Image Handling

**Location**: `client/src/utils/helpers/imageUrl.js`

```javascript
import { getImageUrl } from '../../utils/helpers/imageUrl';

// Automatically converts paths to full URLs
const imageUrl = getImageUrl(imagePath);
// Handles jsDelivr, GitHub, local, or full URLs
```

## 📁 File Storage

### jsDelivr CDN (Primary)

**Setup**:
1. Upload images to GitHub repository
2. Configure environment variables:
   ```env
   GITHUB_REPO_OWNER=your-username
   GITHUB_REPO_NAME=your-repo
   GITHUB_REPO_BRANCH=main
   ```
3. Images are automatically served via jsDelivr CDN

**URL Format**:
```
https://cdn.jsdelivr.net/gh/{owner}/{repo}@{branch}/{category}/{filename}
```

**Example**:
```
https://cdn.jsdelivr.net/gh/username/adoptnest@main/pets/dog-123.jpg
```

### Local Storage (Fallback)

**Directory Structure**:
```
server/uploads/
  ├── pets/
  ├── stories/
  ├── blog/
  ├── surrenders/
  └── users/
```

**File Serving**:
```javascript
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

**Access URL**:
```
http://localhost:5000/uploads/pets/pet-1234567890-abc123.jpg
```

## 🔒 Security

### File Validation
- File type validation (images only: JPEG, JPG, PNG, GIF, WEBP)
- File size limit (5MB default)
- Filename sanitization

### Access Control
- Upload requires authentication
- Admin-only for pets, stories, blog
- User can upload surrender images

### Image URL Security
- jsDelivr URLs are public (CDN)
- Local storage files served via Express static middleware
- No direct file system access from frontend

## 🖼️ Image Management

### Image URL Generation
```javascript
// Backend
const { getImageUrl } = require('../utils/imageManager');
const url = getImageUrl('pets', 'dog.jpg', cloudUrl);

// Frontend
import { getImageUrl } from '../../utils/helpers/imageUrl';
const url = getImageUrl(imagePath);
```

### Image Deletion
```javascript
const { deleteOldImage } = require('../utils/imageManager');

// Only works for local storage files
// jsDelivr/GitHub URLs cannot be deleted via API
await deleteOldImage(oldImagePath);
```

**Note**: jsDelivr/GitHub URLs cannot be deleted via API. Delete files from GitHub repository manually.

## 📝 Usage Examples

### Using jsDelivr URLs

**Backend**:
```javascript
// Store jsDelivr URL in database
const imageUrl = getJsDelivrUrl('pets/dog.jpg', 'pets');
petData.image = imageUrl;
```

**Frontend**:
```javascript
// Automatically handles jsDelivr URLs
<img src={getImageUrl(pet.image)} alt={pet.name} />
```

### Local Storage (Development)

**Backend**:
```javascript
// If GitHub not configured, falls back to local path
const imageUrl = `/uploads/pets/${filename}`;
petData.image = imageUrl;
```

## ⚙️ Configuration

### Environment Variables

**Backend** (`server/.env`):
```env
# jsDelivr Configuration (Optional)
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo
GITHUB_REPO_BRANCH=main

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880  # 5MB
```

**Frontend** (`client/.env`):
```env
# jsDelivr Configuration (Optional)
VITE_GITHUB_USER=your-username
VITE_GITHUB_REPO=your-repo
VITE_GITHUB_BRANCH=main
VITE_GITHUB_BASE_PATH=images  # Optional base path
```

## 🔄 Migration Notes

- **Current State**: Uses jsDelivr CDN (GitHub-hosted images) as primary storage
- **Local Storage**: Available as fallback for development
- **Manual Upload**: Images must be uploaded to GitHub repository manually
- **URL Format**: Supports jsDelivr, GitHub raw, and local paths

---

**Next**: See [Notifications Feature](./notifications.md).

