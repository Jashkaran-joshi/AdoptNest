const express = require('express');
const router = express.Router();
const {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../config/upload');
const validate = require('../validators');
const { petSchema } = require('../validators/schemas');

router.get('/', getPets);
router.get('/:id', getPet);
router.post('/', protect, authorize('admin'), upload.category('pets').single('image'), validate(petSchema), createPet);
router.put('/:id', protect, authorize('admin'), upload.category('pets').single('image'), validate(petSchema), updatePet);
router.delete('/:id', protect, authorize('admin'), deletePet);

module.exports = router;

