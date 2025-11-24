const { getJsDelivrUrl } = require('../services/jsdelivrService');

// @desc    Generate jsDelivr URL from GitHub path
// @route   GET /api/upload/jsdelivr-url
// @access  Private
exports.getJsDelivrUrl = async (req, res, next) => {
  try {
    const { path, category } = req.query;
    
    if (!path) {
      return res.status(400).json({
        success: false,
        message: 'Path parameter is required',
        code: 'PATH_REQUIRED'
      });
    }

    const cdnUrl = getJsDelivrUrl(path, category || 'general');

    res.status(200).json({
      success: true,
      url: cdnUrl,
      path: path,
      category: category || 'general'
    });
  } catch (error) {
    console.error('jsDelivr URL generation error:', error);
    next(error);
  }
};

// Note: File upload endpoint removed - images must be uploaded to GitHub manually
// Then use jsDelivr CDN URLs to reference them
