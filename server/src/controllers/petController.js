const petService = require('../services/petService');
const { getJsDelivrUrl } = require('../services/jsdelivrService');

// @desc    Get all pets
// @route   GET /api/pets
// @access  Public
exports.getPets = async (req, res, next) => {
  try {
    const result = await petService.getPets(req.query);
    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    // Handle database connection errors
    if (error.name === 'MongoServerError' || error.name === 'MongooseError') {
      return res.status(503).json({
        success: false,
        message: 'Database connection error. Please try again later.',
        code: 'DATABASE_ERROR'
      });
    }
    
    next(error);
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
exports.getPet = async (req, res, next) => {
  try {
    const pet = await petService.getPetById(req.params.id);
    res.status(200).json({
      success: true,
      pet
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
        code: 'NOT_FOUND'
      });
    }
    next(error);
  }
};

// @desc    Create pet
// @route   POST /api/pets
// @access  Private/Admin
exports.createPet = async (req, res, next) => {
  try {
    // Handle image URL (images must be uploaded to GitHub and referenced via jsDelivr CDN)
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'pets');
      }
      // Image URL already set in req.body.image
    } else {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required. Please provide a jsDelivr CDN URL or GitHub image path.',
        code: 'IMAGE_REQUIRED'
      });
    }

    const pet = await petService.createPet(req.body, req.user.id);
    res.status(201).json({
      success: true,
      pet
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
exports.updatePet = async (req, res, next) => {
  try {
    // Get existing pet to check for old image
    const existingPet = await petService.getPetById(req.params.id);
    const oldImagePath = existingPet?.image;

    // Handle image URL update
    if (req.body.image || req.body.imageUrl) {
      const imageUrl = req.body.image || req.body.imageUrl;
      // Convert relative path to jsDelivr URL if needed
      if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(imageUrl, 'pets');
      } else {
        req.body.image = imageUrl;
      }
    }

    const pet = await petService.updatePet(req.params.id, req.body);
    res.status(200).json({
      success: true,
      pet
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
        code: 'NOT_FOUND'
      });
    }
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
exports.deletePet = async (req, res, next) => {
  try {
    const result = await petService.deletePet(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    if (error.message === 'NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Pet not found',
        code: 'NOT_FOUND'
      });
    }
    next(error);
  }
};
