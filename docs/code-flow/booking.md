# Booking Code Flow

## 📅 Complete Booking Process

### Step 1: Select Service
```
User visits /book-service
  ↓
Frontend displays service options
  ↓
Services: Grooming, Vet, Boarding, Daycare, Training
  ↓
User selects service
```

### Step 2: Fill Booking Form
```
User fills booking form
  ↓
Fields:
  - Service type
  - Date and time
  - Pet selection (optional)
  - Quantity (for boarding/daycare)
  - Notes
  - Contact information
  ↓
User submits form
```

### Step 3: Submit Booking
```
Frontend: POST /api/bookings
  Body: Booking data
  ↓
Backend: bookingController.createBooking()
  ↓
Middleware: protect (verify user)
  ↓
Validation: bookingSchema validation
  ↓
Controller: bookingService.createBooking(data, userId)
  ↓
Service: Calculate amount based on service and quantity
  ↓
Service: If petId provided, verify pet exists
  ↓
Service: Create booking
  ↓
Database: Booking.create(bookingData)
  ↓
Return: Booking object
  ↓
Frontend shows confirmation
```

### Step 4: View Bookings
```
User visits /bookings
  ↓
Frontend: GET /api/bookings
  ↓
Backend: bookingController.getBookings()
  ↓
Middleware: protect
  ↓
Controller: bookingService.getBookings(userId, role)
  ↓
Service: Query bookings (user's or all for admin)
  ↓
Database: Booking.find(query).populate('petId', 'userId')
  ↓
Return: Bookings array
  ↓
Frontend displays bookings
```

### Step 5: Update/Cancel Booking
```
User clicks update/cancel
  ↓
Frontend: PUT /api/bookings/:id or DELETE /api/bookings/:id
  ↓
Backend: bookingController.updateBooking() or cancelBooking()
  ↓
Middleware: protect
  ↓
Service: Verify user owns booking (or is admin)
  ↓
Service: Update status or cancel
  ↓
Database: Booking.save() or update
  ↓
Return: Updated booking
```

## 💰 Price Calculation

### Service Prices
- Grooming: ₹500
- Vet / Doctor: ₹800
- Boarding (per night): ₹1000
- Daycare (per day): ₹400
- Training Session: ₹1200

### Calculation Logic
```javascript
// Boarding and Daycare multiply by quantity
if (service === 'Boarding' || service === 'Daycare') {
  amount = basePrice * qty;
} else {
  amount = basePrice;
}
```

---

**Next**: See [File Upload Flow](./file-upload.md).

