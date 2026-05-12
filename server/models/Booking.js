const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  startDate: { type: Date, required: true },
  numberOfPeople: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  discountApplied: { type: Number, default: 0 }, // Discount percentage
  discountAmount: { type: Number, default: 0 }, // Actual discount amount in rupees
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: { type: String, default: '' },
  contactPhone: { type: String, required: true },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'paid', 'refunded'],
    default: 'unpaid'
  },
  cancellationReason: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
