const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  token: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['password-reset', 'email-verification'],
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600 // 1 hour
  }
}, {
  timestamps: true
});

TokenSchema.index({ token: 1 });
TokenSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Token', TokenSchema);

