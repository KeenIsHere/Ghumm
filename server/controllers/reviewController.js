const Review = require('../models/Review');
const Booking = require('../models/Booking');
const Package = require('../models/Package');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { packageId, bookingId, rating, comment } = req.body;
    if (!packageId || !bookingId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    // Check booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Invalid booking' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ user: req.user._id, package: packageId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this package' });
    }

    const review = await Review.create({
      user: req.user._id,
      package: packageId,
      booking: bookingId,
      rating: Number(rating),
      comment
    });

    // Update package average rating
    const reviews = await Review.find({ package: packageId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Package.findByIdAndUpdate(packageId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    res.status(201).json({ success: true, review, message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get reviews for a package
exports.getPackageReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ package: req.params.packageId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const packageId = review.package;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate average
    const reviews = await Review.find({ package: packageId });
    const avgRating = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
    await Package.findByIdAndUpdate(packageId, {
      averageRating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length
    });

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
