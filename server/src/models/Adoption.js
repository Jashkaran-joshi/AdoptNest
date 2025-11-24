const mongoose = require('mongoose');

const AdoptionSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet',
    required: true
  },
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  experience: {
    type: String,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  otherPets: {
    type: Boolean,
    default: false
  },
  otherPetsDetails: {
    type: String,
    trim: true
  },
  homeType: {
    type: String,
    enum: ['apartment', 'house', 'condo', 'other']
  },
  yard: {
    type: Boolean,
    default: false
  },
  hoursAlone: {
    type: String,
    required: true,
    trim: true
  },
  references: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

AdoptionSchema.index({ applicantId: 1 });
AdoptionSchema.index({ petId: 1 });
AdoptionSchema.index({ status: 1 });

module.exports = mongoose.model('Adoption', AdoptionSchema);

