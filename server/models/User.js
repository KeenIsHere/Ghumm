const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  // Premium fields
  isPremium: { type: Boolean, default: false },
  premiumTier: { type: String, enum: [null, 'silver', 'gold', 'platinum'], default: null },
  premiumExpiry: { type: Date },
  premiumStartDate: { type: Date },
  billingCycle: { type: String, enum: ['monthly', 'annual'] },
  nextBillingDate: { type: Date },
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'PremiumSubscription' },
  // User info
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  country: { type: String, default: '' },
  profileImage: { type: String, default: '' }, // Base64 or URL
  bio: { type: String, default: '', maxlength: 500 },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ['male', 'female', 'other', ''], default: '' },
  // Preferences
  theme: { type: String, enum: ['light', 'dark'], default: 'light' },
  notificationsEnabled: { type: Boolean, default: true },
  emailNotifications: { type: Boolean, default: true },
  // Email verification
  verifyOtp: { type: String, default: '' },
  verifyOtpExpireAt: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  // Password reset
  resetOtp: { type: String, default: '' },
  resetOtpExpireAt: { type: Number, default: 0 },
}, { timestamps: true });

// Index for premium lookups
userSchema.index({ isPremium: 1, premiumExpiry: 1 });
userSchema.index({ premiumTier: 1 });

module.exports = mongoose.model('User', userSchema);
