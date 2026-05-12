const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  register, login, logout,
  sendVerifyOtp, verifyEmail,
  sendResetOtp, resetPassword,
  checkAuth
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/send-verify-otp', auth, sendVerifyOtp);
router.post('/verify-email', auth, verifyEmail);
router.post('/send-reset-otp', sendResetOtp);
router.post('/reset-password', resetPassword);
router.get('/check', auth, checkAuth);

module.exports = router;
