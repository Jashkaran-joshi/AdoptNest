const express = require('express');
const router = express.Router();
const {
  createSurrender,
  getSurrenders,
  getSurrender,
  updateSurrenderStatus
} = require('../controllers/surrenderController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/upload');
const validate = require('../validators');
const { surrenderSchema, statusUpdateSchema } = require('../validators/schemas');

router.post('/', protect, upload.category('surrenders').single('image'), validate(surrenderSchema), createSurrender);
router.get('/', protect, getSurrenders);
router.get('/:id', protect, getSurrender);
router.patch('/:id', protect, authorize('admin'), validate(statusUpdateSchema), updateSurrenderStatus);

module.exports = router;

