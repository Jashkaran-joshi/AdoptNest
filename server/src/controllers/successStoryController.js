const SuccessStory = require('../models/SuccessStory');
const { getJsDelivrUrl } = require('../services/jsdelivrService');

// @desc    Get all success stories
// @route   GET /api/stories
// @access  Public
exports.getStories = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.published !== undefined) {
      query.published = req.query.published === 'true';
    }
    
    const stories = await SuccessStory.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single success story
// @route   GET /api/stories/:id
// @access  Public
exports.getStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      story
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create success story
// @route   POST /api/stories
// @access  Private/Admin
exports.createStory = async (req, res, next) => {
  try {
    // Handle image URL (images must be uploaded to GitHub and referenced via jsDelivr CDN)
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'stories');
      }
    }

    const story = await SuccessStory.create(req.body);

    res.status(201).json({
      success: true,
      story
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update success story
// @route   PUT /api/stories/:id
// @access  Private/Admin
exports.updateStory = async (req, res, next) => {
  try {
    // Get existing story to check for old image
    const existingStory = await SuccessStory.findById(req.params.id);
    const oldImagePath = existingStory?.image;

    // Handle image URL update
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'stories');
      }
    }

    const story = await SuccessStory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      story
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete success story
// @route   DELETE /api/stories/:id
// @access  Private/Admin
exports.deleteStory = async (req, res, next) => {
  try {
    const story = await SuccessStory.findById(req.params.id);

    if (!story) {
      return res.status(404).json({
        success: false,
        message: 'Story not found',
        code: 'NOT_FOUND'
      });
    }

    // Note: jsDelivr/GitHub images cannot be deleted via API - delete from GitHub repo manually if needed

    await SuccessStory.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Story deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

