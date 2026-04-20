const User = require('../models/User');
const PremiumTier = require('../models/PremiumTier');
const PremiumSubscription = require('../models/PremiumSubscription');
const RewardPoints = require('../models/RewardPoints');
const PremiumRequest = require('../models/PremiumRequest');
const sendEmail = require('../config/mailer');
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

// Initiate premium payment (generate eSewa form data)
exports.initiatePayment = async (req, res) => {
  try {
    const { tierName, billingCycle } = req.body;

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

    // CHECK IF USER HAS APPROVED REQUEST FOR THIS TIER & BILLING CYCLE
    const approvedRequest = await PremiumRequest.findOne({
      userId: req.user._id,
      tierName,
      billingCycle,
      status: 'approved'
    });

    if (!approvedRequest) {
      return res.status(403).json({
        success: false,
        message: 'Your premium request for this tier has not been approved by admin. Please submit a request first.'
      });
    }

    // Get tier details
    const tier = await PremiumTier.findOne({ name: tierName, isActive: true });
    if (!tier) {
      return res.status(404).json({ success: false, message: 'Tier not found' });
    }

    const amount = billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;
    const transactionUuid = `PREM-${req.user._id}-${Date.now()}`;

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
      paymentMethod: 'esewa',
      esewaRefId: transactionUuid
    });

    await subscription.save();

    // Link request to subscription
    approvedRequest.paymentCompleted = false;
    await approvedRequest.save();

    // Generate eSewa signature
    const esewaData = {
      amount: amount,
      tax_amount: 0,
      total_amount: amount,
      transaction_uuid: transactionUuid,
      product_code: process.env.ESEWA_MERCHANT_CODE,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `${process.env.CLIENT_URL}/payment/success?type=premium&subscriptionId=${subscription._id}`,
      failure_url: `${process.env.CLIENT_URL}/payment/failure?type=premium`,
      signed_field_names: 'total_amount,transaction_uuid,product_code',
    };

    // Create HMAC signature
    const signedMessage = `total_amount=${esewaData.total_amount},transaction_uuid=${esewaData.transaction_uuid},product_code=${esewaData.product_code}`;
    const hmac = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY);
    hmac.update(signedMessage);
    esewaData.signature = hmac.digest('base64');

    res.json({
      success: true,
      payment: {
        subscriptionId: subscription._id,
        amount,
        tierName: tier.displayName,
        billingCycle
      },
      esewaData,
      esewaUrl: process.env.ESEWA_GATEWAY_URL
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Initiate premium upgrade (creates payment request for eSewa)
exports.initiatePremiumUpgrade = async (req, res) => {
  try {
    const { tierName, billingCycle } = req.body;

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

    // Check if user already has active premium
    const user = await User.findById(req.user._id);
    if (user.isPremium && user.premiumExpiry > Date.now()) {
      return res.status(400).json({ success: false, message: 'Already has active premium subscription' });
    }

    // Generate unique transaction ID
    const transactionId = `PREM-${req.user._id}-${Date.now()}`;

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
      paymentMethod: 'esewa'
    });

    await subscription.save();

    // Return eSewa payment details
    res.json({
      success: true,
      payment: {
        transactionId,
        amount,
        tier: tier.displayName,
        billingCycle,
        subscriptionId: subscription._id,
        message: 'Redirect user to eSewa for payment'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Verify premium payment from eSewa (called by payment controller)
exports.verifyPremiumPayment = async (req, res) => {
  try {
    const { subscriptionId, esewaRefId, transactionCode } = req.body;

    const subscription = await PremiumSubscription.findById(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ success: false, message: 'Subscription not found' });
    }

    if (subscription.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Update subscription to active
    subscription.status = 'active';
    subscription.esewaRefId = esewaRefId;
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
        redeemedPoints: 0
      });
    }

    // Send email confirmation
    const user = await User.findById(req.user._id);
    const tier = await PremiumTier.findOne({ name: subscription.tierName });
    
    await sendEmail(user.email, 'GhummGhamm - Premium Subscription Activated',
      `<h2>Welcome to ${tier.displayName}!</h2>
       <p>Your premium subscription has been activated successfully.</p>
       <p><strong>Tier:</strong> ${tier.displayName}</p>
       <p><strong>Billing Cycle:</strong> ${subscription.billingCycle}</p>
       <p><strong>Valid Until:</strong> ${subscription.expiryDate.toDateString()}</p>
       <p><strong>Discount:</strong> ${tier.discount}% on all bookings</p>
       <p>Enjoy exclusive benefits and priority support!</p>`
    );

    res.json({ success: true, message: 'Premium subscription activated' });
  } catch (error) {
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
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(req.user._id, {
      isPremium: false,
      premiumTier: null,
      premiumExpiry: null,
      subscriptionId: null
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

    const user = await User.findById(memberId);
    if (!user || !user.isPremium) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    const newExpiry = new Date(user.premiumExpiry.getTime() + days * 24 * 60 * 60 * 1000);

    await User.findByIdAndUpdate(memberId, { premiumExpiry: newExpiry });
    
    const subscription = await PremiumSubscription.findById(user.subscriptionId);
    subscription.expiryDate = newExpiry;
    subscription.nextBillingDate = newExpiry;
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
    await subscription.save();

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
    const user = await User.findById(req.user._id);
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

    const requests = await PremiumRequest.find({ status })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email createdAt')
      .populate('approvedBy', 'name email')
      .sort({ requestedAt: -1 });

    const total = await PremiumRequest.countDocuments({ status });

    res.json({
      success: true,
      requests,
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
