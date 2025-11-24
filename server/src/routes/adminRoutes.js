const express = require('express');
const router = express.Router();
const {
  getStats,
  getUsers,
  updateUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../validators');
const { adminUserUpdateSchema } = require('../validators/schemas');

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/users', protect, authorize('admin'), getUsers);
router.patch('/users/:id', protect, authorize('admin'), validate(adminUserUpdateSchema), updateUser);

module.exports = router;

