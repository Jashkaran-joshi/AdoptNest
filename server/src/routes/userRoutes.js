const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const validate = require('../validators');
const { updateProfileSchema } = require('../validators/schemas');

router.get('/me', protect, getProfile);
router.put('/me', protect, validate(updateProfileSchema), updateProfile);

module.exports = router;

