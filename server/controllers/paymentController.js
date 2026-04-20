const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PremiumSubscription = require('../models/PremiumSubscription');
const PremiumTier = require('../models/PremiumTier');
const RewardPoints = require('../models/RewardPoints');
const sendEmail = require('../config/mailer');

// Initiate eSewa payment
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId).populate('package', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Already paid' });
    }

    const transactionUuid = `GGTT-${booking._id}-${Date.now()}`;

    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalPrice,
      method: method || 'esewa',
      transactionId: transactionUuid,
      status: 'pending'
    });

    // For eSewa integration, return payment details for frontend form submission
    if (method === 'esewa' || !method) {
      const esewaData = {
        amount: booking.totalPrice,
        tax_amount: 0,
        total_amount: booking.totalPrice,
        transaction_uuid: transactionUuid,
        product_code: process.env.ESEWA_MERCHANT_CODE,
        product_service_charge: 0,
        product_delivery_charge: 0,
        success_url: `${process.env.CLIENT_URL}/payment/success`,
        failure_url: `${process.env.CLIENT_URL}/payment/failure`,
        signed_field_names: 'total_amount,transaction_uuid,product_code',
      };

      // Generate signature
      const signedMessage = `total_amount=${esewaData.total_amount},transaction_uuid=${esewaData.transaction_uuid},product_code=${esewaData.product_code}`;
      const hmac = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY);
      hmac.update(signedMessage);
      esewaData.signature = hmac.digest('base64');

      return res.json({
        success: true,
        payment,
        esewaData,
        esewaUrl: process.env.ESEWA_GATEWAY_URL
      });
    }

    res.json({ success: true, payment, message: 'Payment initiated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment (callback from eSewa)
exports.verifyPayment = async (req, res) => {
  try {
    const { transaction_uuid, status } = req.query;

    const payment = await Payment.findOne({ transactionId: transaction_uuid });
    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    if (status === 'COMPLETE') {
      payment.status = 'completed';
      payment.paidAt = new Date();
      await payment.save();

      const booking = await Booking.findById(payment.booking).populate('user');
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      await booking.save();

      // Award reward points if premium member
      const user = booking.user;
      if (user.isPremium) {
        const subscription = await PremiumSubscription.findOne({ userId: user._id, status: 'active' });
        if (subscription) {
          const tier = await PremiumTier.findOne({ name: subscription.tierName });
          if (tier) {
            // Calculate reward points: (amount / 100) * multiplier
            const basePoints = Math.floor(payment.amount / 100);
            const rewardPoints = Math.floor(basePoints * tier.rewardMultiplier);

            let rewards = await RewardPoints.findOne({ userId: user._id });
            if (!rewards) {
              rewards = new RewardPoints({ userId: user._id });
            }

            rewards.totalPoints += rewardPoints;
            rewards.availablePoints += rewardPoints;
            rewards.transactions.push({
              type: 'earned',
              points: rewardPoints,
              description: `Earned from booking - ${booking._id}`,
              bookingId: booking._id
            });

            await rewards.save();
          }
        }
      }

      try {
        await sendEmail(booking.user.email, 'Payment Confirmation - GhummGhamm',
          `<h2>Payment Successful! ✅</h2>
           <p>Your payment of Rs. ${payment.amount} has been confirmed.</p>
           <p>Your booking is now confirmed!</p>
           ${booking.discountAmount ? `<p><strong>You saved Rs. ${Math.round(booking.discountAmount)} with your premium membership!</strong></p>` : ''}
           ${user.isPremium ? `<p>Reward points have been added to your account!</p>` : ''}`
        );
      } catch (_) { /* non-critical */ }

      return res.json({ success: true, message: 'Payment verified successfully' });
    }

    payment.status = 'failed';
    await payment.save();
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get payment history for user
exports.getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate({ path: 'booking', populate: { path: 'package', select: 'title' } })
      .sort({ createdAt: -1 });
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
