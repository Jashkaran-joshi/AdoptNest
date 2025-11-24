const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet'
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
    trim: true
  },
  service: {
    type: String,
    required: true,
    enum: ['Grooming', 'Vet / Doctor', 'Boarding (per night)', 'Daycare (per day)', 'Training Session']
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  qty: {
    type: Number,
    default: 1,
    min: 1
  },
  notes: {
    type: String,
    trim: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Change Requested'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

BookingSchema.index({ userId: 1 });
BookingSchema.index({ status: 1 });
BookingSchema.index({ date: 1 });

module.exports = mongoose.model('Booking', BookingSchema);

