const mongoose = require('mongoose');

const DonationContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    required: true,
    trim: true,
    enum: ['general', 'sponsor-pet', 'monthly-support', 'one-time', 'other']
  },
  message: {
    type: String,
    trim: true
  },
  // User reference (if logged in)
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Status for admin tracking
  status: {
    type: String,
    enum: ['new', 'contacted', 'completed', 'archived'],
    default: 'new'
  }
}, {
  timestamps: true
});

DonationContactSchema.index({ createdAt: -1 });
DonationContactSchema.index({ status: 1 });
DonationContactSchema.index({ user: 1 });

module.exports = mongoose.model('DonationContact', DonationContactSchema);

