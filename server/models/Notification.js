const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['package_added', 'booking_confirmed', 'payment_received', 'premium_approved', 'general'],
      default: 'general',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      // Store related object ID (packageId, bookingId, etc.)
      packageId: mongoose.Schema.Types.ObjectId,
      bookingId: mongoose.Schema.Types.ObjectId,
      paymentId: mongoose.Schema.Types.ObjectId,
      relatedUserId: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: Date,
    icon: {
      type: String,
      default: 'bell', // bell, package, check, star, etc.
    },
    color: {
      type: String,
      default: 'blue', // blue, green, orange, red, purple
    },
    action: {
      // Optional action when user clicks notification
      type: String,
      text: String,
      link: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Auto-delete notifications after 30 days
      expires: 30 * 24 * 60 * 60,
    },
  },
  { timestamps: true }
);

// Indexes for performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
