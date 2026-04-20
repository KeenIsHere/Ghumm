const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { initiatePayment, verifyPayment, getMyPayments } = require('../controllers/paymentController');

router.post('/initiate', auth, initiatePayment);
router.get('/verify', auth, verifyPayment);
router.get('/my', auth, getMyPayments);

module.exports = router;
