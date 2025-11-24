const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a pet name'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Please add a pet type'],
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  breed: {
    type: String,
    trim: true
  },
  age: {
    type: Number
  },
  ageGroup: {
    type: String,
    enum: ['Young', 'Adult', 'Senior']
  },
  gender: {
    type: String,
    enum: ['Male', 'Female']
  },
  location: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Available', 'Adopted', 'Pending'],
    default: 'Available'
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for search
PetSchema.index({ name: 'text', breed: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Pet', PetSchema);

