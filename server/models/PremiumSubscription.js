const mongoose = require('mongoose');

const premiumSubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tierName: { type: String, enum: ['silver', 'gold', 'platinum'], required: true },
  billingCycle: { type: String, enum: ['monthly', 'annual'], required: true },
  monthlyPrice: { type: Number, required: true },
  startDate: { type: Date, required: true, default: Date.now },
  expiryDate: { type: Date, required: true },
  nextBillingDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'active', 'cancelled', 'expired', 'suspended'], default: 'pending' },
  paymentMethod: String, // esewa, card, etc
  esewaRefId: String, // eSewa transaction reference
  autoRenew: { type: Boolean, default: true },
  cancelledAt: Date,
  cancelledReason: String,
  currentRewardPoints: { type: Number, default: 0 },
  rewardPointsHistory: [{
    amount: Number,
    reason: String,
    addedAt: { type: Date, default: Date.now }
  }],
  bookingDiscountsUsed: { type: Number, default: 0 },
  discountAmountSaved: { type: Number, default: 0 },
}, { timestamps: true });

// Index for quick lookup
premiumSubscriptionSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('PremiumSubscription', premiumSubscriptionSchema);
