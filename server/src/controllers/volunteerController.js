const Volunteer = require('../models/Volunteer');

// @desc    Get all volunteers
// @route   GET /api/volunteers
// @access  Private/Admin
exports.getVolunteers = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }

    const volunteers = await Volunteer.find(query)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      volunteers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single volunteer
// @route   GET /api/volunteers/:id
// @access  Private/Admin
exports.getVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findById(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      volunteer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create volunteer
// @route   POST /api/volunteers
// @access  Public (for applications) or Private/Admin
exports.createVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    res.status(201).json({
      success: true,
      volunteer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update volunteer
// @route   PUT /api/volunteers/:id
// @access  Private/Admin
exports.updateVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      volunteer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete volunteer
// @route   DELETE /api/volunteers/:id
// @access  Private/Admin
exports.deleteVolunteer = async (req, res, next) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

