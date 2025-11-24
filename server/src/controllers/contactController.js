const ContactMessage = require('../models/ContactMessage');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
exports.submitContact = async (req, res, next) => {
  try {
    const contactMessage = await ContactMessage.create(req.body);

    res.status(201).json({
      success: true,
      message: contactMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get contact messages (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read
// @route   PATCH /api/contact/:id
// @access  Private/Admin
exports.markMessageRead = async (req, res, next) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        message: 'Message not found',
        code: 'NOT_FOUND'
      });
    }

    message.status = 'read';
    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

