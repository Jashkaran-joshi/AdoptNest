const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Image Manager Utility
 * Handles organized image storage, cleanup, and path management
 */

// Base upload directory
const baseUploadDir = path.isAbsolute(config.upload.dir)
  ? config.upload.dir
  : path.join(__dirname, '..', '..', config.upload.dir);

// Category-based subdirectories
const UPLOAD_CATEGORIES = {
  pets: 'pets',
  users: 'users',
  stories: 'stories',
  blog: 'blog',
  surrenders: 'surrenders',
  general: 'general' // For misc uploads
};

/**
 * Ensure upload directories exist
 */
function ensureUploadDirectories() {
  // Create base directory
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
  }

  // Create category subdirectories
  Object.values(UPLOAD_CATEGORIES).forEach(category => {
    const categoryDir = path.join(baseUploadDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });
}

/**
 * Generate consistent filename
 * Format: {category}-{timestamp}-{random}.{ext}
 */
function generateFilename(category, originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1E9);
  const sanitizedCategory = category.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  return `${sanitizedCategory}-${timestamp}-${random}${ext}`;
}

/**
 * Get full file path for a category
 */
function getFilePath(category, filename) {
  const categoryDir = UPLOAD_CATEGORIES[category] || UPLOAD_CATEGORIES.general;
  return path.join(baseUploadDir, categoryDir, filename);
}

/**
 * Get relative URL path for serving
 * Now supports jsDelivr CDN URLs, GitHub URLs, and local storage (backward compatibility)
 * @param {string} category - Category name
 * @param {string} filename - Filename or URL (jsDelivr, GitHub, or local path)
 * @param {string} cloudUrl - Optional CDN URL (if provided, returns this instead)
 * @returns {string} Image URL
 */
function getImageUrl(category, filename, cloudUrl = null) {
  // If cloud URL is provided (from jsDelivr or GitHub), return it directly
  if (cloudUrl && (cloudUrl.startsWith('http://') || cloudUrl.startsWith('https://'))) {
    return cloudUrl;
  }
  
  // If filename is already a full URL (jsDelivr, GitHub, or other), return it
  if (filename && (filename.startsWith('http://') || filename.startsWith('https://'))) {
    return filename;
  }
  
  // Try to convert to jsDelivr URL if it's a relative path
  const { getJsDelivrUrl } = require('../services/jsdelivrService');
  try {
    return getJsDelivrUrl(filename, category);
  } catch (error) {
    // Fallback to local storage path (for backward compatibility)
    const categoryDir = UPLOAD_CATEGORIES[category] || UPLOAD_CATEGORIES.general;
    return `/uploads/${categoryDir}/${filename}`;
  }
}

/**
 * Delete image file safely
 * Supports local storage (jsDelivr/GitHub URLs are not deletable via API)
 * @param {string} imagePath - Image path or URL
 * @returns {Promise<boolean>} True if deleted successfully
 */
async function deleteImage(imagePath) {
  try {
    if (!imagePath) return false;

    // jsDelivr/GitHub URLs cannot be deleted via API (they're in GitHub repo)
    // Only local storage files can be deleted
    if (imagePath.includes('cdn.jsdelivr.net') || imagePath.includes('raw.githubusercontent.com') || imagePath.includes('github.com')) {
      console.warn('⚠️  Cannot delete jsDelivr/GitHub URLs. Delete the file from GitHub repository manually.');
      return false;
    }

    // Handle local storage paths
    let filePath;
    if (path.isAbsolute(imagePath)) {
      filePath = imagePath;
    } else {
      // Remove leading slash if present
      const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
      filePath = path.join(baseUploadDir, cleanPath);
    }

    // Check if file exists and is within upload directory
    if (fs.existsSync(filePath) && filePath.startsWith(baseUploadDir)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
}

/**
 * Delete old image when updating a record
 * Supports local storage (jsDelivr/GitHub URLs cannot be deleted via API)
 * @param {string} oldImagePath - Image path or URL
 * @returns {Promise<boolean>} True if deleted successfully
 */
async function deleteOldImage(oldImagePath) {
  if (!oldImagePath) return false;

  try {
    // jsDelivr/GitHub URLs cannot be deleted via API (they're in GitHub repo)
    if (oldImagePath.includes('cdn.jsdelivr.net') || oldImagePath.includes('raw.githubusercontent.com') || oldImagePath.includes('github.com')) {
      console.warn('⚠️  Cannot delete jsDelivr/GitHub URLs. Delete the file from GitHub repository manually.');
      return false;
    }
    
    // Handle local storage paths
    // Format: /uploads/{category}/{filename}
    const pathParts = oldImagePath.split('/').filter(p => p);
    
    if (pathParts.length >= 3 && pathParts[0] === 'uploads') {
      const category = pathParts[1];
      const filename = pathParts.slice(2).join('/'); // Handle nested paths if any
      const filePath = path.join(baseUploadDir, category, filename);
      
      if (fs.existsSync(filePath) && filePath.startsWith(baseUploadDir)) {
        fs.unlinkSync(filePath);
        return true;
      }
    }
    
    // Fallback: try direct path
    return deleteImage(oldImagePath);
  } catch (error) {
    console.error('Error deleting old image:', error);
    return false;
  }
}

/**
 * Clean up orphaned images (images not referenced in database)
 * This can be run periodically as a maintenance task
 */
async function cleanupOrphanedImages(models) {
  const referencedImages = new Set();
  
  // Collect all image paths from models
  for (const { model, imageField } of models) {
    try {
      const docs = await model.find({ [imageField]: { $exists: true, $ne: '' } });
      docs.forEach(doc => {
        if (doc[imageField]) {
          referencedImages.add(doc[imageField]);
        }
      });
    } catch (error) {
      console.error(`Error collecting images from ${model.modelName}:`, error);
    }
  }

  // Find all image files in upload directories
  const allFiles = [];
  Object.values(UPLOAD_CATEGORIES).forEach(category => {
    const categoryDir = path.join(baseUploadDir, category);
    if (fs.existsSync(categoryDir)) {
      const files = fs.readdirSync(categoryDir);
      files.forEach(file => {
        const filePath = path.join(categoryDir, file);
        if (fs.statSync(filePath).isFile()) {
          const imageUrl = `/uploads/${category}/${file}`;
          allFiles.push({ path: filePath, url: imageUrl });
        }
      });
    }
  });

  // Delete files not referenced in database
  let deletedCount = 0;
  allFiles.forEach(({ path: filePath, url }) => {
    if (!referencedImages.has(url)) {
      try {
        fs.unlinkSync(filePath);
        deletedCount++;
      } catch (error) {
        console.error(`Error deleting orphaned file ${filePath}:`, error);
      }
    }
  });

  return deletedCount;
}

// Initialize directories on module load
ensureUploadDirectories();

module.exports = {
  UPLOAD_CATEGORIES,
  ensureUploadDirectories,
  generateFilename,
  getFilePath,
  getImageUrl,
  deleteImage,
  deleteOldImage,
  cleanupOrphanedImages,
  baseUploadDir
};

