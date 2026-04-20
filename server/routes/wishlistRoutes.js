const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist, isInWishlist, getWishlistCount } = require('../controllers/wishlistController');
const { auth } = require('../middleware/auth');

// All routes are protected
router.use(auth);

// Get user's wishlist
router.get('/', getWishlist);

// Get wishlist count
router.get('/count', getWishlistCount);

// Check if package is in wishlist
router.get('/check/:packageId', isInWishlist);

// Add to wishlist
router.post('/add', addToWishlist);

// Remove from wishlist
router.post('/remove', removeFromWishlist);

module.exports = router;
