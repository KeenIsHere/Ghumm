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
      enum: ['package_added', 'booking_confirmed', 'payment_received', 'payment_confirmed', 'premium_approved', 'premium_activated', 'general'],
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
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    data: {
      // Store related object ID (packageId, bookingId, etc.)
      packageId: mongoose.Schema.Types.ObjectId,
      bookingId: mongoose.Schema.Types.ObjectId,
      paymentId: mongoose.Schema.Types.ObjectId,
      subscriptionId: mongoose.Schema.Types.ObjectId,
      tier: String,
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
      default: 'blue', // blue, green, orange, red, purple, gold
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
