/**
 * Controllers Index
 * Centralized controller exports
 */

const adminController = require('./adminController');
const adoptionController = require('./adoptionController');
const authController = require('./authController');
const blogController = require('./blogController');
const bookingController = require('./bookingController');
const contactController = require('./contactController');
const donationContactController = require('./donationContactController');
const petController = require('./petController');
const successStoryController = require('./successStoryController');
const surrenderController = require('./surrenderController');
const uploadController = require('./uploadController');
const userController = require('./userController');
const volunteerController = require('./volunteerController');

module.exports = {
  adminController,
  adoptionController,
  authController,
  blogController,
  bookingController,
  contactController,
  donationContactController,
  petController,
  successStoryController,
  surrenderController,
  uploadController,
  userController,
  volunteerController,
};

