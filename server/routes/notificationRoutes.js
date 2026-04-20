const express = require('express');
const auth = require('../middleware/auth');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
  getRecentPackages,
} = require('../controllers/notificationController');

const router = express.Router();

// Get all notifications
router.get('/', auth, getNotifications);

// Get unread count
router.get('/unread-count', auth, getUnreadCount);

// Get recent package notifications
router.get('/recent-packages', auth, getRecentPackages);

// Mark notification as read
router.put('/:notificationId/read', auth, markAsRead);

// Mark all as read
router.put('/mark-all/read', auth, markAllAsRead);

// Delete notification
router.delete('/:notificationId', auth, deleteNotification);

// Delete all notifications
router.delete('/', auth, deleteAllNotifications);

module.exports = router;
