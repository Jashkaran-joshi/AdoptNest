const Booking = require('../models/Booking');
const Pet = require('../models/Pet');

// Service pricing
const SERVICE_PRICES = {
  'Grooming': 500,
  'Vet / Doctor': 800,
  'Boarding (per night)': 1000,
  'Daycare (per day)': 400,
  'Training Session': 1200
};

class BookingService {
  calculateAmount(service, qty = 1) {
    const basePrice = SERVICE_PRICES[service] || 0;
    
    // For boarding and daycare, multiply by quantity
    if (service === 'Boarding (per night)' || service === 'Daycare (per day)') {
      return basePrice * qty;
    }
    
    return basePrice;
  }

  async createBooking(bookingData, userId) {
    bookingData.userId = userId;

    // Calculate amount
    bookingData.amount = this.calculateAmount(bookingData.service, bookingData.qty || 1);

    // If petId provided, verify it exists and get name
    if (bookingData.petId) {
      const pet = await Pet.findById(bookingData.petId);
      if (pet) {
        bookingData.petName = pet.name;
      }
    }

    const booking = await Booking.create(bookingData);
    return booking;
  }

  async getBookings(userId, role, filters = {}) {
    const query = {};

    // If not admin, only show user's bookings
    if (role !== 'admin') {
      query.userId = userId;
    }

    // Filter by status
    if (filters.status) {
      query.status = filters.status;
    }

    const bookings = await Booking.find(query)
      .populate('petId', 'name type image')
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    return bookings;
  }

  async getBookingById(id, userId, role) {
    const query = { _id: id };

    // If not admin, only allow access to own bookings
    if (role !== 'admin') {
      query.userId = userId;
    }

    const booking = await Booking.findOne(query)
      .populate('petId')
      .populate('userId', 'name email');

    if (!booking) {
      throw new Error('NOT_FOUND');
    }

    return booking;
  }

  async updateBooking(id, updateData, userId, role) {
    const query = { _id: id };

    // If not admin, only allow access to own bookings
    if (role !== 'admin') {
      query.userId = userId;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      throw new Error('NOT_FOUND');
    }

    // Update fields
    if (updateData.date) booking.date = updateData.date;
    if (updateData.time) booking.time = updateData.time;
    if (updateData.notes !== undefined) booking.notes = updateData.notes;
    if (updateData.qty) booking.qty = updateData.qty;

    // Recalculate amount if service or qty changed
    if (updateData.service || updateData.qty) {
      booking.amount = this.calculateAmount(booking.service, booking.qty || 1);
    }

    // If user is updating, mark as change requested
    if (role !== 'admin') {
      booking.status = 'Change Requested';
    } else if (updateData.status) {
      booking.status = updateData.status;
    }

    await booking.save();
    return booking;
  }

  async cancelBooking(id, userId, role) {
    const query = { _id: id };

    // If not admin, only allow access to own bookings
    if (role !== 'admin') {
      query.userId = userId;
    }

    const booking = await Booking.findOne(query);

    if (!booking) {
      throw new Error('NOT_FOUND');
    }

    booking.status = 'Cancelled';
    await booking.save();

    return { message: 'Booking cancelled successfully', booking };
  }
}

module.exports = new BookingService();

