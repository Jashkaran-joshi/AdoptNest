const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContactMessages,
  markMessageRead
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../validators');
const { contactSchema } = require('../validators/schemas');

router.post('/', validate(contactSchema), submitContact);
router.get('/', protect, authorize('admin'), getContactMessages);
router.patch('/:id', protect, authorize('admin'), markMessageRead);

module.exports = router;

