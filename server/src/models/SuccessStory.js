const mongoose = require('mongoose');

const SuccessStorySchema = new mongoose.Schema({
  petName: {
    type: String,
    required: true,
    trim: true
  },
  petType: {
    type: String,
    enum: ['Dog', 'Cat', 'Bird', 'Rabbit', 'Other'],
    required: true
  },
  adopterName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  story: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  adoptedDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

SuccessStorySchema.index({ published: 1, createdAt: -1 });

module.exports = mongoose.model('SuccessStory', SuccessStorySchema);

