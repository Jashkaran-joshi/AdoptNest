const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');

// @desc    Create adoption application
// @route   POST /api/adoptions
// @access  Private
exports.createAdoption = async (req, res, next) => {
  try {
    // Add applicant ID if user is logged in
    if (req.user) {
      req.body.applicantId = req.user.id;
    }

    // Verify pet exists
    const pet = await Pet.findById(req.body.petId);
    if (!pet) {
      return res.status(404).json({
        message: 'Pet not found',
        code: 'PET_NOT_FOUND'
      });
    }

    const adoption = await Adoption.create(req.body);

    res.status(201).json({
      success: true,
      adoption
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get adoptions
// @route   GET /api/adoptions
// @access  Private
exports.getAdoptions = async (req, res, next) => {
  try {
    let query = {};

    // If not admin, only show user's adoptions
    if (req.user.role !== 'admin') {
      query.applicantId = req.user.id;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const adoptions = await Adoption.find(query)
      .populate('petId', 'name type breed image')
      .populate('applicantId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      adoptions
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single adoption
// @route   GET /api/adoptions/:id
// @access  Private
exports.getAdoption = async (req, res, next) => {
  try {
    let query = { _id: req.params.id };

    // If not admin, only allow access to own adoptions
    if (req.user.role !== 'admin') {
      query.applicantId = req.user.id;
    }

    const adoption = await Adoption.findOne(query)
      .populate('petId')
      .populate('applicantId', 'name email');

    if (!adoption) {
      return res.status(404).json({
        message: 'Adoption application not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      adoption
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update adoption status
// @route   PATCH /api/adoptions/:id
// @access  Private/Admin
exports.updateAdoptionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const adoption = await Adoption.findById(req.params.id);

    if (!adoption) {
      return res.status(404).json({
        message: 'Adoption application not found',
        code: 'NOT_FOUND'
      });
    }

    adoption.status = status;
    if (req.body.notes) {
      adoption.notes = req.body.notes;
    }

    await adoption.save();

    // If approved, update pet status
    if (status === 'Approved') {
      await Pet.findByIdAndUpdate(adoption.petId, { status: 'Adopted' });
    }

    res.status(200).json({
      success: true,
      adoption
    });
  } catch (error) {
    next(error);
  }
};

