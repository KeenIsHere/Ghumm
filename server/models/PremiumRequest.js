const mongoose = require('mongoose');

const premiumRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tierName: {
    type: String,
    enum: ['silver', 'gold', 'platinum'],
    required: true
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'annual'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  reason: {
    type: String
  },
  message: {
    type: String
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: {
    type: Date
  },
  rejectedReason: {
    type: String
  },
  rejectedAt: {
    type: Date
  },
  paymentCompleted: {
    type: Boolean,
    default: false
  },
  paymentCompletedAt: {
    type: Date
  }
}, { timestamps: true });

// Index for faster queries
premiumRequestSchema.index({ userId: 1, status: 1 });
premiumRequestSchema.index({ status: 1, requestedAt: -1 });

module.exports = mongoose.model('PremiumRequest', premiumRequestSchema);
