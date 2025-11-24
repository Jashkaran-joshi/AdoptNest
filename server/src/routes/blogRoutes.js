const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
} = require('../controllers/blogController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/upload');
const validate = require('../validators');
const { blogPostSchema } = require('../validators/schemas');

router.get('/', getBlogPosts);
router.get('/:id', getBlogPost);
router.post('/', protect, authorize('admin'), upload.category('blog').single('image'), validate(blogPostSchema), createBlogPost);
router.put('/:id', protect, authorize('admin'), upload.category('blog').single('image'), validate(blogPostSchema), updateBlogPost);
router.delete('/:id', protect, authorize('admin'), deleteBlogPost);

module.exports = router;

