const mongoose = require('mongoose');

const SurrenderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other']
  },
  age: {
    type: Number
  },
  reason: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  contact: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['Pending', 'Received', 'Rejected'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

SurrenderSchema.index({ submittedBy: 1 });
SurrenderSchema.index({ status: 1 });

module.exports = mongoose.model('Surrender', SurrenderSchema);

