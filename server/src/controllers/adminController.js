const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');
const Surrender = require('../models/Surrender');
const Booking = require('../models/Booking');
const ContactMessage = require('../models/ContactMessage');

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res, next) => {
  try {
    const [
      totalPets,
      availablePets,
      adoptionRequests,
      pendingRequests,
      surrenders,
      bookings,
      totalUsers,
      activeUsers,
      unreadMessages
    ] = await Promise.all([
      Pet.countDocuments(),
      Pet.countDocuments({ status: 'Available' }),
      Adoption.countDocuments(),
      Adoption.countDocuments({ status: 'Pending' }),
      Surrender.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ status: 'active' }),
      ContactMessage.countDocuments({ status: 'unread' })
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalPets,
        availablePets,
        adoptionRequests,
        pendingRequests,
        surrenders,
        bookings,
        totalUsers,
        activeUsers,
        unreadMessages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.role) {
      query.role = req.query.role;
    }

    if (req.query.status) {
      query.status = req.query.status;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res, next) => {
  try {
    const { role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        code: 'NOT_FOUND'
      });
    }

    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

