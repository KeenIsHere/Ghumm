const Booking = require('../models/Booking');
const Package = require('../models/Package');
const User = require('../models/User');
const PremiumSubscription = require('../models/PremiumSubscription');
const RewardPoints = require('../models/RewardPoints');
const PremiumTier = require('../models/PremiumTier');

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { packageId, startDate, numberOfPeople, specialRequests, contactPhone } = req.body;
    if (!packageId || !startDate || !numberOfPeople || !contactPhone) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const pkg = await Package.findById(packageId);
    if (!pkg || !pkg.isActive) {
      return res.status(404).json({ success: false, message: 'Package not found or unavailable' });
    }

    // Check premium-only access
    if (pkg.isPremiumOnly && !req.user.isPremium && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Premium membership required for this package' });
    }

    // Check priority booking days for premium members
    let priorityDaysAllowed = 0;
    let tierDiscount = 0;
    let discountAmount = 0;
    
    if (req.user.isPremium) {
      const subscription = await PremiumSubscription.findOne({ userId: req.user._id, status: 'active' });
      if (subscription) {
        const tier = await PremiumTier.findOne({ name: subscription.tierName });
        if (tier) {
          priorityDaysAllowed = tier.priorityDays;
          tierDiscount = tier.discount;
        }
      }
    }

    // Validate booking date against priority days
    const bookingDate = new Date(startDate);
    const today = new Date();
    const daysInAdvance = Math.ceil((bookingDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysInAdvance < 1 && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Cannot book for past dates' });
    }

    if (!req.user.isPremium && daysInAdvance > 30) {
      return res.status(400).json({ success: false, message: 'Non-premium members can only book up to 30 days in advance' });
    }

    // Calculate price with discount
    let unitPrice = pkg.price;
    if (req.user.isPremium && pkg.premiumPrice) {
      unitPrice = pkg.premiumPrice;
    }
    
    // Apply tier discount percentage
    if (tierDiscount > 0) {
      discountAmount = (unitPrice * tierDiscount) / 100;
      unitPrice = unitPrice - discountAmount;
    }

    const totalPrice = unitPrice * numberOfPeople;
    const totalDiscountAmount = discountAmount * numberOfPeople;

    const booking = await Booking.create({
      user: req.user._id,
      package: packageId,
      startDate,
      numberOfPeople,
      totalPrice,
      discountApplied: tierDiscount,
      discountAmount: totalDiscountAmount,
      specialRequests: specialRequests || '',
      contactPhone
    });

    res.status(201).json({ success: true, booking, message: 'Booking created successfully', discount: tierDiscount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('package', 'title location coverImage duration price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single booking
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('package')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    booking.cancellationReason = req.body.reason || 'Cancelled by user';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
