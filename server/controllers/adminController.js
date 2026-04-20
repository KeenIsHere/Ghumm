const User = require('../models/User');
const Package = require('../models/Package');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Review = require('../models/Review');

// Dashboard stats
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalPackages, totalBookings, totalPayments, recentBookings] = await Promise.all([
      User.countDocuments(),
      Package.countDocuments(),
      Booking.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Booking.find().populate('user', 'name email').populate('package', 'title').sort({ createdAt: -1 }).limit(10)
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalPackages,
        totalBookings,
        totalRevenue: totalPayments[0]?.total || 0,
      },
      recentBookings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user, message: 'User role updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('package', 'title location price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    res.json({ success: true, booking, message: 'Booking status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('user', 'name email')
      .populate({ path: 'booking', populate: { path: 'package', select: 'title' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name email')
      .populate('package', 'title')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reports
exports.getReports = async (req, res) => {
  try {
    const [bookingsByStatus, monthlyRevenue, packagePopularity] = await Promise.all([
      Booking.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Payment.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$paidAt' } },
            revenue: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: -1 } },
        { $limit: 12 }
      ]),
      Booking.aggregate([
        { $group: { _id: '$package', bookings: { $sum: 1 } } },
        { $sort: { bookings: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'packages',
            localField: '_id',
            foreignField: '_id',
            as: 'packageInfo'
          }
        },
        { $unwind: '$packageInfo' },
        { $project: { title: '$packageInfo.title', bookings: 1 } }
      ])
    ]);

    res.json({
      success: true,
      reports: { bookingsByStatus, monthlyRevenue, packagePopularity }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
