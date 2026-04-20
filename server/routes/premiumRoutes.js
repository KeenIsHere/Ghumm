const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  getAllTiers,
  getUserSubscription,
  initiatePayment,
  initiatePremiumUpgrade,
  verifyPremiumPayment,
  cancelSubscription,
  addRewardPoints,
  redeemRewardPoints,
  getAllPremiumMembers,
  getPremiumMemberDetail,
  extendMembership,
  suspendMembership,
  getPremiumAnalytics,
  requestPremiumPlan,
  getUserRequests,
  getPendingRequests,
  approvePremiumRequest,
  rejectPremiumRequest,
  getRequestDetail,
  getAllTiersAdmin,
  updatePremiumTier,
  getTierAdmin
} = require('../controllers/premiumController');

// Public routes
router.get('/tiers', getAllTiers);

// Protected user routes
router.get('/subscription', auth, getUserSubscription);
router.post('/request-plan', auth, requestPremiumPlan);
router.get('/my-requests', auth, getUserRequests);
router.get('/request/:requestId', auth, getRequestDetail);
router.post('/initiate-payment', auth, initiatePayment);
router.post('/upgrade', auth, initiatePremiumUpgrade);
router.post('/verify-payment', auth, verifyPremiumPayment);
router.post('/cancel', auth, cancelSubscription);
router.post('/add-rewards', auth, addRewardPoints);
router.post('/redeem-rewards', auth, redeemRewardPoints);

// Protected admin routes
router.get('/admin/pending-requests', auth, getPendingRequests);
router.post('/admin/approve-request', auth, approvePremiumRequest);
router.post('/admin/reject-request', auth, rejectPremiumRequest);
router.get('/admin/members', auth, getAllPremiumMembers);
router.get('/admin/members/:memberId', auth, getPremiumMemberDetail);
router.post('/admin/extend-membership', auth, extendMembership);
router.post('/admin/suspend-membership', auth, suspendMembership);
router.get('/admin/analytics', auth, getPremiumAnalytics);

// Admin tier management routes
router.get('/admin/tiers', auth, getAllTiersAdmin);
router.get('/admin/tiers/:tierId', auth, getTierAdmin);
router.put('/admin/tiers/:tierId', auth, updatePremiumTier);

module.exports = router;

module.exports = router;
