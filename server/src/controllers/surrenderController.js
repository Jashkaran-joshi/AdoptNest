const Surrender = require('../models/Surrender');
const { getJsDelivrUrl } = require('../services/jsdelivrService');

// @desc    Create surrender request
// @route   POST /api/surrenders
// @access  Private
exports.createSurrender = async (req, res, next) => {
  try {
    // Handle image URL (images must be uploaded to GitHub and referenced via jsDelivr CDN)
    if (req.body.image) {
      // Convert relative path to jsDelivr URL if needed
      if (!req.body.image.startsWith('http://') && !req.body.image.startsWith('https://')) {
        req.body.image = getJsDelivrUrl(req.body.image, 'surrenders');
      }
    }

    // Add user ID if logged in
    if (req.user) {
      req.body.submittedBy = req.user.id;
      if (!req.body.contact) {
        req.body.contact = req.user.email;
      }
    }

    const surrender = await Surrender.create(req.body);

    res.status(201).json({
      success: true,
      surrender
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get surrenders
// @route   GET /api/surrenders
// @access  Private
exports.getSurrenders = async (req, res, next) => {
  try {
    let query = {};

    // If not admin, only show user's surrenders
    if (req.user.role !== 'admin') {
      query.submittedBy = req.user.id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const surrenders = await Surrender.find(query)
      .populate('submittedBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      surrenders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single surrender
// @route   GET /api/surrenders/:id
// @access  Private
exports.getSurrender = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // If not admin, only allow viewing own surrenders
    if (req.user.role !== 'admin') {
      query.submittedBy = req.user.id;
    }

    const surrender = await Surrender.findOne(query)
      .populate('submittedBy', 'name email');

    if (!surrender) {
      return res.status(404).json({
        success: false,
        message: 'Surrender not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      surrender
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update surrender status
// @route   PATCH /api/surrenders/:id
// @access  Private/Admin
exports.updateSurrenderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const surrender = await Surrender.findById(req.params.id);

    if (!surrender) {
      return res.status(404).json({
        message: 'Surrender request not found',
        code: 'NOT_FOUND'
      });
    }

    surrender.status = status;
    await surrender.save();

    res.status(200).json({
      success: true,
      surrender
    });
  } catch (error) {
    next(error);
  }
};

