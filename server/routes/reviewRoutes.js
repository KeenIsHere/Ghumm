const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { createReview, getPackageReviews, deleteReview } = require('../controllers/reviewController');

router.post('/', auth, createReview);
router.get('/package/:packageId', getPackageReviews);
router.delete('/:id', auth, deleteReview);

module.exports = router;
