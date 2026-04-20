const express = require('express');
const router = express.Router();
const { auth, adminOnly } = require('../middleware/auth');
const {
  getDashboard, getAllUsers, updateUserRole, deleteUser,
  getAllBookings, updateBookingStatus,
  getAllPayments, getAllReviews, getReports
} = require('../controllers/adminController');

router.use(auth, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/bookings', getAllBookings);
router.put('/bookings/:id/status', updateBookingStatus);
router.get('/payments', getAllPayments);
router.get('/reviews', getAllReviews);
router.get('/reports', getReports);

module.exports = router;
