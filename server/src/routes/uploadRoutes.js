const express = require('express');
const router = express.Router();
const { getJsDelivrUrl } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Generate jsDelivr CDN URL from GitHub path
// Query params: ?path=pets/dog.jpg&category=pets
router.get('/jsdelivr-url', protect, getJsDelivrUrl);

// Note: File upload endpoint removed - images must be uploaded to GitHub manually
// Then use jsDelivr CDN URLs to reference them in the application

module.exports = router;

