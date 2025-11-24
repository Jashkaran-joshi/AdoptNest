const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Encrypt password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  try {
    const config = require('../config');
    
    // Validate JWT secret is set
    if (!config.jwt.secret || config.jwt.secret === 'your-super-secret-jwt-key-change-in-production') {
      console.error('⚠️  WARNING: JWT_SECRET is not set or using default value. Please set a secure JWT_SECRET in environment variables.');
    }
    
    if (!config.jwt.secret) {
      throw new Error('JWT_SECRET is not configured');
    }
    
    return jwt.sign({ id: this._id }, config.jwt.secret, {
      expiresIn: config.jwt.expire
    });
  } catch (error) {
    console.error('JWT token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

// Virtual for isAdmin
UserSchema.virtual('isAdmin').get(function() {
  return this.role === 'admin';
});

module.exports = mongoose.model('User', UserSchema);

