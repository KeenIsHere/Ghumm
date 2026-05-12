const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  packageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  addedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Ensure user can only add a package once to wishlist
wishlistSchema.index({ userId: 1, packageId: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
