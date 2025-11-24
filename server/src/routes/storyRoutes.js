const express = require('express');
const router = express.Router();
const {
  getStories,
  getStory,
  createStory,
  updateStory,
  deleteStory
} = require('../controllers/successStoryController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/upload');
const validate = require('../validators');
const { successStorySchema } = require('../validators/schemas');

router.get('/', getStories);
router.get('/:id', getStory);
router.post('/', protect, authorize('admin'), upload.category('stories').single('image'), validate(successStorySchema), createStory);
router.put('/:id', protect, authorize('admin'), upload.category('stories').single('image'), validate(successStorySchema), updateStory);
router.delete('/:id', protect, authorize('admin'), deleteStory);

module.exports = router;

