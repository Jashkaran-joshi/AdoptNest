const mongoose = require('mongoose');

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  category: {
    type: String,
    enum: ['Care', 'Health', 'Adoption', 'Behavior', 'Nutrition', 'Training', 'Community', 'Success', 'Policy'],
    default: 'Care'
  },
  author: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  readTime: {
    type: String,
    default: '5 min'
  },
  image: {
    type: String,
    default: ''
  },
  excerpt: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  published: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes (slug already has index: true, so we don't need to index it again)
BlogPostSchema.index({ published: 1, createdAt: -1 });
BlogPostSchema.index({ category: 1 });

module.exports = mongoose.model('BlogPost', BlogPostSchema);

