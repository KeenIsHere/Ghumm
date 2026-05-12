const mongoose = require('mongoose');

const premiumTierSchema = new mongoose.Schema({
  name: { type: String, required: true, enum: ['silver', 'gold', 'platinum'], unique: true },
  displayName: { type: String, required: true }, // Silver, Gold, Platinum
  monthlyPrice: { type: Number, required: true }, // in NPR
  annualPrice: { type: Number, required: true },
  discount: { type: Number, required: true }, // 10, 15, 20 percentage
  priorityDays: { type: Number, required: true }, // 2, 5, 999 (for unlimited)
  rewardMultiplier: { type: Number, required: true }, // 1x, 2x, 3x
  exclusivePackageCount: { type: Number, default: 0 },
  cancellationDays: { type: Number, default: 0 }, // 0, 3, 7 days
  insuranceIncluded: { type: Boolean, default: false },
  supportLevel: { type: String, enum: ['standard', 'priority', 'vip'], default: 'standard' },
  features: [String], // Array of feature descriptions
  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('PremiumTier', premiumTierSchema);
