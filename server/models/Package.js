const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Difficult', 'Expert'], required: true },
  duration: { type: Number, required: true }, // in days
  maxGroupSize: { type: Number, required: true },
  price: { type: Number, required: true },
  premiumPrice: { type: Number },
  elevation: { type: String, default: '' },
  season: { type: String, default: '' },
  includes: [{ type: String }],
  excludes: [{ type: String }],
  itinerary: [{
    day: Number,
    title: String,
    description: String
  }],
  images: [{ type: String }],
  coverImage: { type: String, default: '' },
  isPremiumOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  availableSlots: { type: Number, default: 0 },
  startDates: [{ type: Date }],
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

packageSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
