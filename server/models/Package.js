const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  tagline: { type: String, trim: true, maxlength: 100, default: '' },
  description: { type: String, required: true },
  location: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Moderate', 'Difficult', 'Expert'], required: true },
  difficultyNote: { type: String, default: '' },
  duration: { type: Number, required: true },
  maxAltitude: { type: String, default: '' },
  season: { type: String, default: '' },
  bestSeasonTip: { type: String, default: '' },
  trekType: { type: String, enum: ['Teahouse', 'Camping', 'Mixed'], default: 'Teahouse' },
  maxGroupSize: { type: Number, required: true },
  availableSlots: { type: Number, default: 0 },
  price: { type: Number, required: true },
  priceUSD: { type: Number, default: 0 },
  premiumPrice: { type: Number, default: 0 },
  pricingType: { type: String, enum: ['per_person', 'per_group'], default: 'per_person' },
  includes: [{ type: String }],
  excludes: [{ type: String }],
  itinerary: [{
    day: Number,
    description: String,
    walkingHours: String,
  }],
  permits: [{
    name: String,
    cost: String,
  }],
  images: [{
    url: { type: String },
    isCover: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  }],
  coverImage: { type: String, default: '' },
  availableDates: [{ type: Date }],
  isPremiumOnly: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  showOnMap: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

packageSchema.index({ title: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Package', packageSchema);
