const multer = require('multer');
const path = require('path');
const config = require('./index');

/**
 * Upload Configuration for Cloud Storage (Firebase Storage)
 * Uses memory storage since files are uploaded directly to cloud storage
 */

// Use memory storage for cloud uploads (files go directly to Firebase Storage)
const storage = multer.memoryStorage();

// File filter - validate image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF, WEBP)!'));
  }
};

// Default upload middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxSize
  },
  fileFilter: fileFilter
});

// Category-specific upload middleware factory
// Note: Category is now handled by Firebase Storage service, but we keep this for compatibility
upload.category = (category) => {
  return multer({
    storage: storage,
    limits: {
      fileSize: config.upload.maxSize
    },
    fileFilter: fileFilter
  });
};

module.exports = upload;

