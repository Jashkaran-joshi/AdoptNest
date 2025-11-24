/**
 * Routes Index
 * Centralized route registration
 */

const express = require('express');
const router = express.Router();

// Import all route modules
const authRoutes = require('./authRoutes');
const petRoutes = require('./petRoutes');
const adoptionRoutes = require('./adoptionRoutes');
const surrenderRoutes = require('./surrenderRoutes');
const bookingRoutes = require('./bookingRoutes');
const contactRoutes = require('./contactRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const uploadRoutes = require('./uploadRoutes');
const storyRoutes = require('./storyRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const donationContactRoutes = require('./donationContactRoutes');
const blogRoutes = require('./blogRoutes');

// Register all routes
router.use('/auth', authRoutes);
router.use('/pets', petRoutes);
router.use('/adoptions', adoptionRoutes);
router.use('/surrenders', surrenderRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/upload', uploadRoutes);
router.use('/stories', storyRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/donation-contact', donationContactRoutes);
router.use('/blog', blogRoutes);

module.exports = router;

