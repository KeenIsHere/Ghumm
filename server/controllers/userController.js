const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get my profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, address, city, country, bio, dateOfBirth, gender, theme, notificationsEnabled, emailNotifications } = req.body;
    
    const updateData = {
      name,
      phone,
      address,
      city,
      country,
      bio,
      dateOfBirth,
      gender,
      theme,
      notificationsEnabled,
      emailNotifications
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt');

    res.json({ success: true, user, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    const { profileImage } = req.body;

    if (!profileImage) {
      return res.status(400).json({ success: false, message: 'Image required' });
    }

    if (profileImage.length > 5000000) {
      return res.status(400).json({ success: false, message: 'Image too large (max 5MB)' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage },
      { new: true, runValidators: true }
    ).select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt');

    res.json({ success: true, user, message: 'Profile picture updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update theme preference
exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!['light', 'dark'].includes(theme)) {
      return res.status(400).json({ success: false, message: 'Invalid theme' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { theme },
      { new: true, runValidators: true }
    ).select('-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt');

    res.json({ success: true, user, message: 'Theme updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Both passwords are required' });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Rewards
exports.getRewards = async (req, res) => {
  try {
    const RewardPoints = require('../models/RewardPoints');
    const rewards = await RewardPoints.findOne({ userId: req.user._id });
    
    if (!rewards) {
      return res.json({ success: true, rewards: { userId: req.user._id, totalPoints: 0, availablePoints: 0, redeemedPoints: 0, transactions: [] } });
    }

    res.json({ success: true, rewards });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Upgrade to premium
exports.upgradeToPremium = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        premiumExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      },
      { new: true }
    ).select('-password');

    res.json({ success: true, user, message: 'Upgraded to premium successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
