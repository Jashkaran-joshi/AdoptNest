const express = require('express');
const router = express.Router();
const {
  createDonationContact,
  getDonationContacts,
  getDonationContact,
  updateDonationContact,
  deleteDonationContact
} = require('../controllers/donationContactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../validators');
const { donationContactSchema } = require('../validators/schemas');

// Public route - anyone can submit donation contact form
router.post('/', validate(donationContactSchema), createDonationContact);

// Admin routes
router.get('/', protect, authorize('admin'), getDonationContacts);
router.get('/:id', protect, authorize('admin'), getDonationContact);
router.put('/:id', protect, authorize('admin'), validate(donationContactSchema), updateDonationContact);
router.delete('/:id', protect, authorize('admin'), deleteDonationContact);

module.exports = router;

