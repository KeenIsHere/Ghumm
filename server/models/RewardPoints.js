const mongoose = require('mongoose');

const rewardPointsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  totalPoints: { type: Number, default: 0 },
  availablePoints: { type: Number, default: 0 },
  redeemedPoints: { type: Number, default: 0 },
  transactions: [{
    transactionId: String,
    type: { type: String, enum: ['earned', 'redeemed', 'expired'], required: true },
    points: { type: Number, required: true },
    description: String,
    bookingId: mongoose.Schema.Types.ObjectId,
    discountApplied: Number, // Amount saved in NPR
    expiryDate: Date,
    createdAt: { type: Date, default: Date.now }
  }],
  lastEarnedAt: Date,
  lastRedeemedAt: Date,
}, { timestamps: true });

// Index for quick lookups
rewardPointsSchema.index({ userId: 1 });

module.exports = mongoose.model('RewardPoints', rewardPointsSchema);
