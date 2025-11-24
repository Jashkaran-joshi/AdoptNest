const express = require('express');
const router = express.Router();
const {
  createAdoption,
  getAdoptions,
  getAdoption,
  updateAdoptionStatus
} = require('../controllers/adoptionController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../validators');
const { adoptionSchema, statusUpdateSchema } = require('../validators/schemas');

router.post('/', protect, validate(adoptionSchema), createAdoption);
router.get('/', protect, getAdoptions);
router.get('/:id', protect, getAdoption);
router.patch('/:id', protect, authorize('admin'), validate(statusUpdateSchema), updateAdoptionStatus);

module.exports = router;

