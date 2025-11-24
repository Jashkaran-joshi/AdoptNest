const DonationContact = require('../models/DonationContact');

// @desc    Create donation contact form submission
// @route   POST /api/donation-contact
// @access  Public
exports.createDonationContact = async (req, res, next) => {
  try {
    const donationContact = await DonationContact.create({
      ...req.body,
      user: req.user ? req.user.id : null
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for supporting our nonprofit rescue mission! Your generosity helps us save more homeless and neglected pets. We will contact you soon.',
      donationContact: {
        id: donationContact._id,
        name: donationContact.name,
        email: donationContact.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all donation contacts
// @route   GET /api/donation-contact
// @access  Private/Admin
exports.getDonationContacts = async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.purpose) {
      query.purpose = req.query.purpose;
    }

    const contacts = await DonationContact.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      contacts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation contact
// @route   GET /api/donation-contact/:id
// @access  Private/Admin
exports.getDonationContact = async (req, res, next) => {
  try {
    const contact = await DonationContact.findById(req.params.id)
      .populate('user', 'name email');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Donation contact not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation contact status
// @route   PUT /api/donation-contact/:id
// @access  Private/Admin
exports.updateDonationContact = async (req, res, next) => {
  try {
    const contact = await DonationContact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Donation contact not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      contact
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete donation contact
// @route   DELETE /api/donation-contact/:id
// @access  Private/Admin
exports.deleteDonationContact = async (req, res, next) => {
  try {
    const contact = await DonationContact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Donation contact not found',
        code: 'NOT_FOUND'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Donation contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

