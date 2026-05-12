const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, upgradeToPremium, uploadProfilePicture, updateTheme, getRewards } = require('../controllers/userController');

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/profile-picture', auth, uploadProfilePicture);
router.put('/theme', auth, updateTheme);
router.get('/rewards', auth, getRewards);
router.put('/change-password', auth, changePassword);
router.post('/upgrade-premium', auth, upgradeToPremium);

module.exports = router;
