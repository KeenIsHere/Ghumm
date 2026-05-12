const User = require('../models/User');
const PremiumTier = require('../models/PremiumTier');
const PremiumSubscription = require('../models/PremiumSubscription');
const RewardPoints = require('../models/RewardPoints');
const PremiumRequest = require('../models/PremiumRequest');
const { sendEmail } = require('../config/mailer');
const crypto = require('crypto');

// Get all premium tiers
exports.getAllTiers = async (req, res) => {
  try {
    const tiers = await PremiumTier.find({ isActive: true }).sort({ monthlyPrice: 1 });
    res.json({ success: true, tiers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's current premium subscription
exports.getUserSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('subscriptionId');
    
    if (!user.isPremium) {
      return res.json({ success: true, subscription: null, isPremium: false });
    }

    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    const tier = await PremiumTier.findOne({ name: subscription.tierName });
    const rewards = await RewardPoints.findOne({ userId: req.user._id });

    res.json({
      success: true,
      subscription,
      tier,
      rewards: rewards || { totalPoints: 0, availablePoints: 0 }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate premium payment with Khalti
exports.initiatePayment = async (req, res) => {
  try {
    const { tierName, billingCycle } = req.body;

    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before upgrading to premium',
        requiresVerification: true 
      });
    }

    // Validate input
    if (!tierName || !billingCycle) {
      return res.status(400).json({ success: false, message: 'Tier and billing cycle required' });
    }

    if (!['silver', 'gold', 'platinum'].includes(tierName)) {
      return res.status(400).json({ success: false, message: 'Invalid tier' });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ success: false, message: 'Invalid billing cycle' });
    }

    // Get tier details
    const tier = await PremiumTier.findOne({ name: tierName, isActive: true });
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Tier not found' });
    }

    const amount = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
    const purchaseOrderId = `PREM-${req.user._id}-${Date.now()}`;

    // Create pending subscription
    const subscription = new PremiumSubscription({
      userId: req.user._id,
      tierName,
      billingCycle,
      monthlyPrice: tier.monthlyPrice,
      startDate: new Date(),
      expiryDate: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      nextBillingDate: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'pending',
      paymentMethod: 'khalti'
    });

    await subscription.save();

    // Call Khalti API from backend
    // user already declared above (line 49)
    const khaltiInitPayload = {
      return_url: `${process.env.CLIENT_URL}/payment/success?type=premium&subscriptionId=${subscription._id}`,
      website_url: process.env.CLIENT_URL,
      amount: amount * 100, // Convert to paisa
      purchase_order_id: purchaseOrderId,
      purchase_order_name: `${tier.displayName} Premium Subscription (${billingCycle})`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '9800000000'
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
        console.error('Khalti premium initiate error:', khaltiData);
        subscription.status = 'failed';
        await subscription.save();
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to initiate premium payment with Khalti',
          error: khaltiData.detail || khaltiData
        });
      }

      return res.json({
        success: true,
        subscription,
        payment: {
          subscriptionId: subscription._id,
          amount,
          tierName: tier.displayName,
          billingCycle
        },
        khaltiData: {
          pidx: khaltiData.pidx,
          payment_url: khaltiData.payment_url,
          expires_at: khaltiData.expires_at,
          expires_in: khaltiData.expires_in
        }
      });
    } catch (khaltiError) {
      console.error('Khalti premium API error:', khaltiError);
      subscription.status = 'failed';
      await subscription.save();
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to call Khalti API: ' + khaltiError.message
      });
    }
  } catch (error) {
    console.error('Premium payment initiation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate premium upgrade with Khalti (for users upgrading existing subscriptions)
exports.initiatePremiumUpgrade = async (req, res) => {
  try {
    const { tierName, billingCycle } = req.body;

    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before upgrading your premium tier',
        requiresVerification: true 
      });
    }

    if (!tierName || !billingCycle) {
      return res.status(400).json({ success: false, message: 'Tier and billing cycle required' });
    }

    if (!['silver', 'gold', 'platinum'].includes(tierName)) {
      return res.status(400).json({ success: false, message: 'Invalid tier' });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ success: false, message: 'Invalid billing cycle' });
    }

    const tier = await PremiumTier.findOne({ name: tierName, isActive: true });
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Tier not found' });
    }

    const amount = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
    const purchaseOrderId = `PREM-UPGRADE-${req.user._id}-${Date.now()}`;

    // Create temporary pending subscription
    const subscription = new PremiumSubscription({
      userId: req.user._id,
      tierName,
      billingCycle,
      monthlyPrice: tier.monthlyPrice,
      startDate: new Date(),
      expiryDate: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      nextBillingDate: billingCycle === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'pending',
      paymentMethod: 'khalti'
    });

    await subscription.save();

    // Call Khalti API
    // user already declared above (line 181)
    const khaltiInitPayload = {
      return_url: `${process.env.CLIENT_URL}/payment/success?type=premium&subscriptionId=${subscription._id}`,
      website_url: process.env.CLIENT_URL,
      amount: amount * 100,
      purchase_order_id: purchaseOrderId,
      purchase_order_name: `${tier.displayName} Premium Upgrade (${billingCycle})`,
      customer_info: {
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone || '9800000000'
      },
      merchant_username: 'GhummGhamm'
    };

    try {
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
        subscription.status = 'failed';
        await subscription.save();
        return res.status(400).json({ 
          success: false, 
          message: 'Failed to initiate upgrade payment with Khalti'
        });
      }

      return res.json({
        success: true,
        payment: {
          amount,
          tier: tier.displayName,
          billingCycle,
          subscriptionId: subscription._id
        },
        khaltiData: {
          pidx: khaltiData.pidx,
          payment_url: khaltiData.payment_url
        }
      });
    } catch (khaltiError) {
      subscription.status = 'failed';
      await subscription.save();
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to call Khalti API'
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify premium payment from Khalti
exports.verifyPremiumPayment = async (req, res) => {
  try {
    const { subscriptionId, khaltiPidx, status } = req.body;

    if (!subscriptionId) {
      return res.status(400).json({ success: false, message: 'Subscription ID required' });
    }

    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before activating your premium subscription',
        requiresVerification: true 
      });
    }

    // Handle user cancellation
    if (status === 'User canceled') {
      const subscription = await PremiumSubscription.findById(subscriptionId);
      if (subscription && subscription.userId.toString() === req.user._id.toString()) {
        subscription.status = 'cancelled';
        subscription.cancelledAt = new Date();
        await subscription.save();
      }
      return res.status(400).json({ success: false, message: 'Payment was cancelled by user' });
    }

    const subscription = await PremiumSubscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Idempotency check - if already active, don't process again
    if (subscription.status === 'active') {
      return res.json({ 
        success: true, 
        message: 'Subscription already active', 
        subscription,
        isIdempotent: true 
      });
    }

    // If pidx provided, verify with Khalti
    if (khaltiPidx) {
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
        body: JSON.stringify({ pidx: khaltiPidx })
      });

      const khaltiLookupData = await khaltiLookupResponse.json();

      if (!khaltiLookupResponse.ok || khaltiLookupData.status !== 'Completed') {
        console.error('Khalti premium verification failed:', khaltiLookupData);
        subscription.status = 'failed';
        await subscription.save();
        return res.status(400).json({ 
          success: false, 
          message: 'Payment verification failed with Khalti' 
        });
      }

      subscription.khaltiTransactionId = khaltiLookupData.transaction_id;
    }

    // If this is an upgrade, mark old subscription as upgraded
    const userDoc = await User.findById(req.user._id);
    if (userDoc.isPremium && userDoc.subscriptionId && userDoc.subscriptionId.toString() !== subscriptionId) {
      const oldSubscription = await PremiumSubscription.findById(userDoc.subscriptionId);
      if (oldSubscription && oldSubscription.status === 'active') {
        oldSubscription.status = 'upgraded';
        oldSubscription.upgradedAt = new Date();
        oldSubscription.upgradedToSubscriptionId = subscriptionId;
        await oldSubscription.save();
      }
    }

    // Update subscription to active
    subscription.status = 'active';
    subscription.activatedAt = new Date();
    await subscription.save();

    // Update user with premium status
    await User.findByIdAndUpdate(req.user._id, {
      isPremium: true,
      premiumTier: subscription.tierName,
      premiumExpiry: subscription.expiryDate,
      premiumStartDate: subscription.startDate,
      billingCycle: subscription.billingCycle,
      nextBillingDate: subscription.nextBillingDate,
      subscriptionId: subscription._id
    });

    // Initialize reward points if not exists
    const rewardExists = await RewardPoints.findOne({ userId: req.user._id });
    if (!rewardExists) {
      const tier = await PremiumTier.findOne({ name: subscription.tierName });
      await RewardPoints.create({
        userId: req.user._id,
        totalPoints: 0,
        availablePoints: 0,
        redeemedPoints: 0,
        rewardMultiplier: tier.rewardMultiplier
      });
    }

    // Get tier details
    const tier = await PremiumTier.findOne({ name: subscription.tierName });
    
    // Send email confirmation
    try {
      await sendEmail(userDoc.email, 'Premium Subscription Activated ✨ - GhummGhamm',
        `<h2>Welcome to ${tier.displayName}! 🎉</h2>
         <p>Hi ${userDoc.name},</p>
         <p>Your premium subscription has been successfully activated!</p>
         <p><strong>Tier:</strong> ${tier.displayName}</p>
         <p><strong>Billing Cycle:</strong> ${subscription.billingCycle === 'monthly' ? 'Monthly' : 'Annual'}</p>
         <p><strong>Valid Until:</strong> ${new Date(subscription.expiryDate).toDateString()}</p>
         <p><strong>Discount on Bookings:</strong> ${tier.discount}% 💰</p>
         <p><strong>Reward Points Multiplier:</strong> ${tier.rewardMultiplier}x ⭐</p>
         <p>Enjoy exclusive benefits, priority support, and discounts on all your bookings!</p>
         <p>Thank you for choosing GhummGhamm Premium!</p>`
      );
    } catch (emailErr) {
      console.error('Premium confirmation email failed (non-critical):', emailErr);
    }

    // Create notification
    try {
      const Notification = require('../models/Notification');
      await Notification.create({
        userId: userDoc._id,
        type: 'premium_activated',
        title: '✨ Premium Subscription Activated',
        message: `Congratulations! You are now a ${tier.displayName} member. Enjoy exclusive benefits!`,
        icon: 'star',
        color: 'gold',
        priority: 'high',
        data: { subscriptionId: subscription._id, tier: tier.name }
      });
    } catch (notifErr) {
      console.error('Premium notification creation failed (non-critical):', notifErr);
    }

    res.json({ 
      success: true, 
      message: 'Premium subscription activated successfully',
      subscription,
      tier
    });
  } catch (error) {
    console.error('Premium payment verification error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel premium subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.isPremium) {
      return res.status(400).json({ success: false, message: 'No active subscription' });
    }

    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    
    const tier = await PremiumTier.findOne({ name: subscription.tierName });
    const cancelledWithinDays = tier.cancellationDays;
    const daysPassed = Math.floor((Date.now() - subscription.startDate) / (1000 * 60 * 60 * 24));

    if (daysPassed > cancelledWithinDays && cancelledWithinDays > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Can only cancel within ${cancelledWithinDays} days of purchase. ${daysPassed} days have passed.` 
      });
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    subscription.cancelledReason = req.body.reason || 'User requested cancellation';
    subscription.expiryDate = new Date(); // Set immediate expiry
    subscription.nextBillingDate = null;
    await subscription.save();

    // Update user - completely remove premium
    await User.findByIdAndUpdate(req.user._id, {
      isPremium: false,
      premiumTier: null,
      premiumExpiry: null,
      subscriptionId: null,
      billingCycle: null,
      nextBillingDate: null
    });

    // Send cancellation email
    const userDoc = await User.findById(req.user._id);
    await sendEmail(userDoc.email, 'GhummGhamm - Subscription Cancelled',
      `<h2>Subscription Cancelled</h2>
       <p>Your premium subscription has been cancelled.</p>
       <p>You can reactivate anytime from your profile.</p>`
    );

    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add reward points (called when booking is completed)
exports.addRewardPoints = async (req, res) => {
  try {
    const { points, description, bookingId, discountApplied } = req.body;

    let rewards = await RewardPoints.findOne({ userId: req.user._id });
    if (!rewards) {
      rewards = new RewardPoints({ userId: req.user._id });
    }

    rewards.totalPoints += points;
    rewards.availablePoints += points;
    rewards.lastEarnedAt = new Date();

    rewards.transactions.push({
      transactionId: `TXN-${Date.now()}`,
      type: 'earned',
      points,
      description,
      bookingId,
      discountApplied,
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });

    await rewards.save();

    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Redeem reward points
exports.redeemRewardPoints = async (req, res) => {
  try {
    const { points } = req.body;

    const rewards = await RewardPoints.findOne({ userId: req.user._id });
    if (!rewards || rewards.availablePoints < points) {
      return res.status(400).json({ success: false, message: 'Insufficient reward points' });
    }

    rewards.availablePoints -= points;
    rewards.redeemedPoints += points;
    rewards.lastRedeemedAt = new Date();

    rewards.transactions.push({
      transactionId: `TXN-${Date.now()}`,
      type: 'redeemed',
      points,
      description: 'Reward points redeemed for booking discount'
    });

    await rewards.save();

    res.json({ success: true, message: 'Points redeemed successfully', rewards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ======================== ADMIN OPERATIONS ========================

// Get all premium members (Admin only)
exports.getAllPremiumMembers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const tier = req.query.tier; // Filter by tier if provided

    const query = { isPremium: true, subscriptionId: { $ne: null } };
    if (tier) query.premiumTier = tier;

    const premiumMembers = await User.find(query)
      .select('name email premiumTier premiumExpiry createdAt subscriptionId')
      .populate('subscriptionId', 'status billingCycle startDate expiryDate monthlyPrice')
      .skip(skip)
      .limit(limit)
      .sort({ premiumExpiry: -1 });

    // Filter out any members with null subscriptionId after population
    const validMembers = premiumMembers.filter(member => member.subscriptionId !== null);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      premiumMembers: validMembers,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get premium member details (Admin only)
exports.getPremiumMemberDetail = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { memberId } = req.params;

    const user = await User.findById(memberId)
      .populate('subscriptionId')
      .select('-password -resetOtp -verifyOtp');

    if (!user || !user.isPremium) {
      return res.status(404).json({ success: false, message: 'Premium member not found' });
    }

    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    const tier = await PremiumTier.findOne({ name: user.premiumTier });
    const rewards = await RewardPoints.findOne({ userId: memberId });

    res.json({
      success: true,
      member: user,
      subscription,
      tier,
      rewards
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Extend premium membership (Admin operation)
exports.extendMembership = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { memberId, days } = req.body;

    // Validate days
    if (!days || days < 1) {
      return res.status(400).json({ success: false, message: 'Days must be at least 1' });
    }

    const user = await User.findById(memberId);
    if (!user || !user.isPremium) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    if (subscription.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Can only extend active subscriptions' });
    }

    const newExpiry = new Date(user.premiumExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    // Update user and subscription
    await User.findByIdAndUpdate(memberId, { premiumExpiry: newExpiry });
    
    subscription.expiryDate = newExpiry;
    subscription.nextBillingDate = newExpiry;
    subscription.extendedAt = new Date();
    subscription.extensionDays = (subscription.extensionDays || 0) + days;
    await subscription.save();

    // Send notification
    const userDoc = await User.findById(memberId);
    await sendEmail(userDoc.email, 'GhummGhamm - Membership Extended',
      `<h2>Membership Extended!</h2>
       <p>Your premium membership has been extended for ${days} more days.</p>
       <p>New expiry date: ${newExpiry.toDateString()}</p>`
    );

    res.json({ success: true, message: 'Membership extended', newExpiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Suspend premium membership (Admin operation)
exports.suspendMembership = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { memberId, reason } = req.body;

    const user = await User.findById(memberId);
    if (!user || !user.isPremium) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    subscription.status = 'suspended';
    subscription.suspendedAt = new Date();
    subscription.suspendedReason = reason;
    await subscription.save();

    // Update user - suspend premium access
    await User.findByIdAndUpdate(memberId, {
      isPremium: false,
      premiumTier: null
    });

    // Send notification
    const userDoc = await User.findById(memberId);
    await sendEmail(userDoc.email, 'GhummGhamm - Account Suspended',
      `<h2>Account Suspended</h2>
       <p>Your premium membership has been temporarily suspended.</p>
       <p>Reason: ${reason}</p>
       <p>Please contact support for more information.</p>`
    );

    res.json({ success: true, message: 'Membership suspended' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get premium analytics (Admin only)
exports.getPremiumAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const totalMembers = await User.countDocuments({ isPremium: true });
    const silverMembers = await User.countDocuments({ premiumTier: 'silver' });
    const goldMembers = await User.countDocuments({ premiumTier: 'gold' });
    const platinumMembers = await User.countDocuments({ premiumTier: 'platinum' });

    const subscriptions = await PremiumSubscription.find({ status: 'active' });
    const totalRevenue = subscriptions.reduce((sum, sub) => {
      return sum + (sub.billingCycle === 'monthly' ? sub.monthlyPrice : sub.monthlyPrice * 12);
    }, 0);

    const expiringSoon = await User.countDocuments({
      isPremium: true,
      premiumExpiry: {
        $gte: Date.now(),
        $lte: Date.now() + 7 * 24 * 60 * 60 * 1000
      }
    });

    res.json({
      success: true,
      analytics: {
        totalMembers,
        tierBreakdown: { silverMembers, goldMembers, platinumMembers },
        monthlyRevenue: totalRevenue,
        expiringInWeek: expiringSoon
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= PREMIUM REQUEST FLOW =============

// User requests premium plan
exports.requestPremiumPlan = async (req, res) => {
  try {
    const { tierName, billingCycle, message } = req.body;

    // Check if user is verified
    const user = await User.findById(req.user._id);
    if (!user.isAccountVerified) {
      return res.status(403).json({ 
        success: false, 
        message: 'Please verify your email before requesting a premium plan',
        requiresVerification: true 
      });
    }

    if (!['silver', 'gold', 'platinum'].includes(tierName)) {
      return res.status(400).json({ success: false, message: 'Invalid tier' });
    }

    if (!['monthly', 'annual'].includes(billingCycle)) {
      return res.status(400).json({ success: false, message: 'Invalid billing cycle' });
    }

    // Check if user already has pending request
    const existingRequest = await PremiumRequest.findOne({
      userId: req.user._id,
      status: 'pending'
    });

    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already have a pending request' });
    }

    // Create request
    const premiumRequest = new PremiumRequest({
      userId: req.user._id,
      tierName,
      billingCycle,
      message,
      status: 'pending'
    });

    await premiumRequest.save();

    // Send email to first admin (avoid rate limiting on Mailtrap)
    const admins = await User.find({ role: 'admin' }).limit(1);
    // user already fetched on line 791 above
    const tier = await PremiumTier.findOne({ name: tierName });

    if (admins.length > 0) {
      await sendEmail(admins[0].email, 'GhummGhamm - New Premium Membership Request',
        `<h2>New Premium Membership Request</h2>
         <p><strong>User:</strong> ${user.name} (${user.email})</p>
         <p><strong>Requested Tier:</strong> ${tier.displayName}</p>
         <p><strong>Billing Cycle:</strong> ${billingCycle}</p>
         ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
         <p>Please review and approve/reject this request in the admin dashboard.</p>`
      );
    }

    res.json({ success: true, message: 'Request submitted successfully', request: premiumRequest });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's own requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await PremiumRequest.find({ userId: req.user._id })
      .sort({ requestedAt: -1 })
      .populate('userId', 'name email');

    res.json({ success: true, requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get pending requests (Admin only)
exports.getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const status = req.query.status || 'pending';

    let requests = await PremiumRequest.find({ status })
      .populate('userId', 'name email createdAt')
      .populate('approvedBy', 'name email')
      .sort({ requestedAt: -1 });

    // Filter out orphaned requests (user was deleted)
    requests = requests.filter(req => req.userId !== null);

    // Apply pagination to filtered results
    const total = requests.length;
    const paginatedRequests = requests.slice(skip, skip + limit);

    res.json({
      success: true,
      requests: paginatedRequests,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Approve premium request (Admin only)
exports.approvePremiumRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { requestId, reason } = req.body;
    const request = await PremiumRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Can only approve pending requests' });
    }

    // Update request
    request.status = 'approved';
    request.approvedBy = req.user._id;
    request.approvedAt = new Date();
    request.reason = reason;
    await request.save();

    // Send email to user
    const user = await User.findById(request.userId);
    const tier = await PremiumTier.findOne({ name: request.tierName });

    await sendEmail(user.email, 'GhummGhamm - Premium Request Approved',
      `<h2>Your Premium Request Approved! ✅</h2>
       <p>Your request for <strong>${tier.displayName}</strong> membership has been approved.</p>
       <p>You can now proceed to payment to activate your premium benefits.</p>
       <p>Click <a href="http://localhost:3838/premium">here</a> to complete your payment.</p>`
    );

    res.json({ success: true, message: 'Request approved', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Reject premium request (Admin only)
exports.rejectPremiumRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { requestId, rejectionReason } = req.body;
    const request = await PremiumRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Can only reject pending requests' });
    }

    // Update request
    request.status = 'rejected';
    request.rejectedReason = rejectionReason;
    request.rejectedAt = new Date();
    await request.save();

    // Send email to user
    const user = await User.findById(request.userId);

    await sendEmail(user.email, 'GhummGhamm - Premium Request Rejected',
      `<h2>Premium Request Status</h2>
       <p>Your premium membership request has been reviewed.</p>
       <p><strong>Status:</strong> Not Approved</p>
       ${rejectionReason ? `<p><strong>Reason:</strong> ${rejectionReason}</p>` : ''}
       <p>Please contact support if you have any questions.</p>`
    );

    res.json({ success: true, message: 'Request rejected', request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get request details
exports.getRequestDetail = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await PremiumRequest.findById(requestId)
      .populate('userId', 'name email createdAt isPremium')
      .populate('approvedBy', 'name email');

    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && request.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.json({ success: true, request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============= TIER MANAGEMENT (ADMIN ONLY) =============

// Get all tiers (including inactive - for admin)
exports.getAllTiersAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const tiers = await PremiumTier.find().sort({ monthlyPrice: 1 });
    res.json({ success: true, tiers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update premium tier (admin only)
exports.updatePremiumTier = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { tierId } = req.params;
    const {
      displayName,
      monthlyPrice,
      annualPrice,
      discount,
      priorityDays,
      rewardMultiplier,
      exclusivePackageCount,
      cancellationDays,
      insuranceIncluded,
      supportLevel,
      features,
      description,
      isActive
    } = req.body;

    // Validate prices
    if (monthlyPrice < 0 || annualPrice < 0) {
      return res.status(400).json({ success: false, message: 'Prices cannot be negative' });
    }

    // Validate discount
    if (discount < 0 || discount > 100) {
      return res.status(400).json({ success: false, message: 'Discount must be between 0-100' });
    }

    // Validate reward multiplier
    if (rewardMultiplier < 1) {
      return res.status(400).json({ success: false, message: 'Reward multiplier must be at least 1' });
    }

    const tier = await PremiumTier.findByIdAndUpdate(
      tierId,
      {
        displayName,
        monthlyPrice,
        annualPrice,
        discount,
        priorityDays,
        rewardMultiplier,
        exclusivePackageCount,
        cancellationDays,
        insuranceIncluded,
        supportLevel,
        features: Array.isArray(features) ? features : features?.split(',').map(f => f.trim()).filter(Boolean),
        description,
        isActive
      },
      { new: true, runValidators: true }
    );

    if (!tier) {
      return res.status(404).json({ success: false, message: 'Tier not found' });
    }

    res.json({ success: true, message: 'Tier updated successfully', tier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single tier (admin)
exports.getTierAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const { tierId } = req.params;
    const tier = await PremiumTier.findById(tierId);

    if (!tier) {
      return res.status(404).json({ success: false, message: 'Tier not found' });
    }

    res.json({ success: true, tier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
