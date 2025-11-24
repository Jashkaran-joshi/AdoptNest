const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
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
  city: {
    type: String,
    trim: true
  },
  type: {
    type: String,
    enum: ['volunteer', 'foster'],
    required: true
  },
  availability: {
    type: String,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  why: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

VolunteerSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Volunteer', VolunteerSchema);

