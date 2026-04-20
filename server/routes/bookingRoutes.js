const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const {
  createBooking, getMyBookings, getBooking, cancelBooking
} = require('../controllers/bookingController');

router.post('/', auth, createBooking);
router.get('/my', auth, getMyBookings);
router.get('/:id', auth, getBooking);
router.put('/:id/cancel', auth, cancelBooking);

module.exports = router;
