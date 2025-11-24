const express = require('express');
const router = express.Router();
const {
  getVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  deleteVolunteer
} = require('../controllers/volunteerController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../validators');
const { volunteerSchema } = require('../validators/schemas');

router.get('/', protect, authorize('admin'), getVolunteers);
router.get('/:id', protect, authorize('admin'), getVolunteer);
router.post('/', validate(volunteerSchema), createVolunteer);
router.put('/:id', protect, authorize('admin'), validate(volunteerSchema), updateVolunteer);
router.delete('/:id', protect, authorize('admin'), deleteVolunteer);

module.exports = router;

