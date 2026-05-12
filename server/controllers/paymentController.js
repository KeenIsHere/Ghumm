const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');
const PremiumSubscription = require('../models/PremiumSubscription');
const PremiumTier = require('../models/PremiumTier');
const RewardPoints = require('../models/RewardPoints');
const { sendEmail } = require('../config/mailer');

// Initiate Khalti payment
exports.initiatePayment = async (req, res) => {
  try {
    const { bookingId, method } = req.body;
    const booking = await Booking.findById(bookingId).populate('package', 'title');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    
    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before proceeding with payment',
        requiresVerification: true 
      });
    }
    
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'Already paid' });
    }

    const purchaseOrderId = `ORD-${booking._id}`;

    // Create payment record in DB
    const payment = await Payment.create({
      booking: booking._id,
      user: req.user._id,
      amount: booking.totalPrice,
      method: method || 'khalti',
      transactionId: purchaseOrderId,
      status: 'pending'
    });

    console.log('📝 Payment record created:', {
      _id: payment._id,
      booking: booking._id,
      transactionId: purchaseOrderId,
      amount: booking.totalPrice
    });

    // For Khalti integration, call Khalti API from backend
    if (method === 'khalti' || !method) {
      const user = req.user;
      
      // Ensure user has a phone number for Khalti
      if (!user.phone) {
        return res.status(400).json({ 
          success: false, 
          message: 'Please update your phone number in your profile before making a payment' 
        });
      }

      const khaltiInitPayload = {
        return_url: `${process.env.CLIENT_URL}/payment/success`,
        website_url: process.env.CLIENT_URL,
        amount: booking.totalPrice * 100, // Convert to paisa
        purchase_order_id: purchaseOrderId,
        purchase_order_name: `${booking.package.title} - GhummGhamm`,
        customer_info: {
          name: user.name,
          email: user.email,
          phone: user.phone
        },
        merchant_username: 'GhummGhamm'
      };

      try {
        // Determine endpoint based on environment
        const khaltiEnv = process.env.KHALTI_ENV || 'sandbox';
        const khaltiBaseUrl = khaltiEnv === 'sandbox' 
          ? 'https://dev.khalti.com/api/v2'
          : 'https://khalti.com/api/v2';

        const khaltiResponse = await fetch(`${khaltiBaseUrl}/epayment/initiate/`, {
          method: 'POST',
          headers: {
            'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(khaltiInitPayload)
        });

        const khaltiData = await khaltiResponse.json();

        if (!khaltiResponse.ok) {
          console.error('Khalti initiate error:', khaltiData);
          payment.status = 'failed';
          await payment.save();
          return res.status(400).json({ 
            success: false, 
            message: 'Failed to initiate payment with Khalti',
            error: khaltiData.detail || khaltiData
          });
        }

        // Save khalti pidx to payment record so we can look it up during verification
        payment.khaltiPidx = khaltiData.pidx;
        await payment.save();

        console.log('✅ Khalti payment initiated:', {
          pidx: khaltiData.pidx,
          payment_id: payment._id,
          purchase_order_id: purchaseOrderId
        });

        return res.json({
          success: true,
          payment,
          khaltiData: {
            pidx: khaltiData.pidx,
            payment_url: khaltiData.payment_url,
            expires_at: khaltiData.expires_at,
            expires_in: khaltiData.expires_in
          }
        });
      } catch (khaltiError) {
        console.error('Khalti API error:', khaltiError);
        payment.status = 'failed';
        await payment.save();
        return res.status(500).json({ 
          success: false, 
          message: 'Failed to call Khalti API: ' + khaltiError.message
        });
      }
    }

    res.json({ success: true, payment, message: 'Payment initiated' });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify payment (Khalti lookup)
exports.verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    if (!pidx) {
      return res.status(400).json({ success: false, message: 'pidx is required' });
    }

    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before completing payment',
        requiresVerification: true 
      });
    }

    // Lookup payment with Khalti
    const khaltiEnv = process.env.KHALTI_ENV || 'sandbox';
    const khaltiBaseUrl = khaltiEnv === 'sandbox' 
      ? 'https://dev.khalti.com/api/v2'
      : 'https://khalti.com/api/v2';

    const khaltiLookupResponse = await fetch(`${khaltiBaseUrl}/epayment/lookup/`, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${process.env.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ pidx })
    });

    let khaltiLookupData;
    try {
      khaltiLookupData = await khaltiLookupResponse.json();
    } catch (jsonError) {
      console.error('Failed to parse Khalti response as JSON:', jsonError);
      console.error('Raw response status:', khaltiLookupResponse.status);
      return res.status(500).json({ 
        success: false, 
        message: 'Invalid response from payment gateway'
      });
    }

    if (!khaltiLookupResponse.ok) {
      console.error('Khalti lookup error:', khaltiLookupData);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to verify payment with Khalti'
      });
    }

    console.log('🔐 Full Khalti lookup response:', JSON.stringify(khaltiLookupData, null, 2));
    console.log('🔐 Khalti lookup response:', {
      status: khaltiLookupData.status,
      purchase_order_id: khaltiLookupData.purchase_order_id,
      pidx: khaltiLookupData.pidx,
      transaction_id: khaltiLookupData.transaction_id
    });

    // Check if payment is completed
    if (khaltiLookupData.status !== 'Completed') {
      return res.status(400).json({ 
        success: false, 
        message: `Payment status: ${khaltiLookupData.status}`
      });
    }

    // Find payment record by khaltiPidx
    console.log('🔍 Looking for payment with khaltiPidx:', pidx);
    
    const payment = await Payment.findOne({ khaltiPidx: pidx });
    
    if (!payment) {
      console.error('❌ Payment not found for khaltiPidx:', pidx);
      const recentPayments = await Payment.find({}).sort({ createdAt: -1 }).limit(5).select('khaltiPidx transactionId status');
      console.error('Recent payments:', recentPayments);
      return res.status(404).json({ success: false, message: 'Payment record not found' });
    }
    
    console.log('✅ Payment found:', payment._id);

    // Update payment status
    payment.status = 'completed';
    payment.paidAt = new Date();
    payment.khaltiTransactionId = khaltiLookupData.transaction_id;
    await payment.save();

    const booking = await Booking.findById(payment.booking).populate('user', 'email name phone isPremium');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // Award reward points if premium member
    const bookingUser = booking.user;
    if (bookingUser.isPremium) {
      const subscription = await PremiumSubscription.findOne({ userId: bookingUser._id, status: 'active' });
      if (subscription) {
        const tier = await PremiumTier.findOne({ name: subscription.tierName });
        if (tier) {
          const basePoints = Math.floor(payment.amount / 100);
          const rewardPoints = Math.floor(basePoints * tier.rewardMultiplier);

          let rewards = await RewardPoints.findOne({ userId: bookingUser._id });
          if (!rewards) {
            rewards = new RewardPoints({ userId: bookingUser._id });
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

    // Send confirmation email
    try {
      await sendEmail(booking.user.email, 'Booking Confirmed - Payment Received ✅ - GhummGhamm',
        `<h2>Booking Confirmed!</h2>
         <p>Hi ${bookingUser.name},</p>
         <p>Your payment of <strong>Rs. ${payment.amount}</strong> has been received and confirmed.</p>
         <p>Your booking is now confirmed! 🎉</p>
         ${booking.discountAmount ? `<p><strong>You saved Rs. ${Math.round(booking.discountAmount)} with your premium membership!</strong></p>` : ''}
         ${bookingUser.isPremium ? `<p>✨ <strong>Reward points have been added to your account!</strong></p>` : ''}
         <p>You will receive further details via email shortly.</p>
         <p>Thank you for choosing GhummGhamm!</p>`
      );
    } catch (emailErr) {
      console.error('Email sending failed (non-critical):', emailErr);
    }

    // Create notification for user
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: bookingUser._id,
        type: 'payment_confirmed',
        title: '✅ Payment Received',
        message: `Your booking payment of Rs. ${payment.amount} has been confirmed. Your trip is now booked!`,
        icon: 'check',
        color: 'green',
        priority: 'high',
        data: { bookingId: booking._id }
      });
    } catch (notifErr) {
      console.error('Notification creation failed (non-critical):', notifErr);
    }

    return res.json({ 
      success: true, 
      message: 'Payment verified successfully', 
      khaltiData: khaltiLookupData,
      booking: {
        _id: booking._id,
        paymentStatus: booking.paymentStatus,
        status: booking.status
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
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
