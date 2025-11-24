const BlogPost = require('../models/BlogPost');
const { getJsDelivrUrl } = require('../services/jsdelivrService');

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
exports.getBlogPosts = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.published !== undefined) {
      query.published = req.query.published === 'true';
    }
    if (req.query.category) {
      query.category = req.query.category;
    }

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog post
// @route   GET /api/blog/:id
// @access  Public
exports.getBlogPost = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Validate input
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('BlogController.getBlogPost: Invalid id parameter:', id);
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post identifier',
        code: 'INVALID_ID'
      });
    }

    // Decode URL-encoded identifier and normalize
    // Try-catch to handle cases where id is already decoded or malformed
    let decodedId;
    try {
      decodedId = decodeURIComponent(id.trim());
    } catch (e) {
      // If decode fails, id might already be decoded or malformed, use as-is
      decodedId = id.trim();
    }
    const normalizedSlug = decodedId.toLowerCase();
    
    // Log for debugging
    console.log('BlogController.getBlogPost: Searching for post with:', {
      original: id,
      decoded: decodedId,
      normalizedSlug: normalizedSlug
    });

    // Try to find by slug first (most common case), then by _id
    // Since slug is stored in lowercase (per schema), we can do direct comparison
    // Only try _id lookup if decodedId looks like a valid ObjectId (exactly 24 hex characters)
    // ObjectId format: 24 hexadecimal characters (0-9, a-f, A-F)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(decodedId);
    
    // Build query conditions
    const queryConditions = [{ slug: normalizedSlug }];
    
    // Only add _id condition if it's a valid ObjectId format
    // This prevents CastError when trying to cast a slug string to ObjectId
    if (isValidObjectId) {
      queryConditions.push({ _id: decodedId });
    }
    
    let post = await BlogPost.findOne({
      $or: queryConditions
    });

    // If still not found and decodedId looks like it might be a slug with different casing,
    // try case-insensitive regex search (escape special regex characters)
    if (!post && decodedId.length > 0) {
      const escapedSlug = decodedId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      post = await BlogPost.findOne({
        slug: { $regex: new RegExp(`^${escapedSlug}$`, 'i') }
      });
    }

    if (!post) {
      console.warn('BlogController.getBlogPost: Post not found for:', {
        original: id,
        decoded: decodedId,
        normalizedSlug: normalizedSlug
      });
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        code: 'NOT_FOUND'
      });
    }

    // Only return published posts for public access (unless admin)
    // Note: This check can be added if you want to hide unpublished posts from public
    // For now, we return all posts found

    console.log('BlogController.getBlogPost: Found post:', {
      id: post._id,
      slug: post.slug,
      title: post.title
    });

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('BlogController.getBlogPost: Error:', error);
    
    // Handle MongoDB cast errors (invalid ObjectId format)
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog post identifier format',
        code: 'INVALID_ID_FORMAT'
      });
    }
    next(error);
  }
};

// @desc    Create blog post
// @route   POST /api/blog
// @access  Private/Admin
exports.createBlogPost = async (req, res, next) => {
  try {
    // Handle image URL (images must be uploaded to GitHub and referenced via jsDelivr CDN)
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'blog');
      }
    }

    // Generate slug if not provided
    if (!req.body.slug && req.body.title) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    const post = await BlogPost.create(req.body);

    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog post with this slug already exists',
        code: 'DUPLICATE_SLUG'
      });
    }
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
exports.updateBlogPost = async (req, res, next) => {
  try {
    // Get existing post to check for old image
    const existingPost = await BlogPost.findById(req.params.id);
    const oldImagePath = existingPost?.image;

    // Handle image URL update
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'blog');
      }
    }

    // Generate slug if title changed and slug not provided
    if (req.body.title && !req.body.slug) {
      req.body.slug = req.body.title
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    }

    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      post
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A blog post with this slug already exists',
        code: 'DUPLICATE_SLUG'
      });
    }
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
exports.deleteBlogPost = async (req, res, next) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found',
        code: 'NOT_FOUND'
      });
    }

    // Note: jsDelivr/GitHub images cannot be deleted via API - delete from GitHub repo manually if needed

    await BlogPost.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

