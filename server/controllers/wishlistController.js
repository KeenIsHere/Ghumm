const Wishlist = require('../models/Wishlist');
const Package = require('../models/Package');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id })
      .populate('packageId')
      .sort({ addedAt: -1 });
    
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ success: false, message: 'Package ID required' });
    }

    // Check if package exists
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: req.user._id, packageId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Package already in wishlist' });
    }

    const wishitem = new Wishlist({
      userId: req.user._id,
      packageId
    });

    await wishitem.save();
    await wishitem.populate('packageId');

    res.json({ success: true, message: 'Added to wishlist', wishitem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { packageId } = req.body;

    if (!packageId) {
      return res.status(400).json({ success: false, message: 'Package ID required' });
    }

    const wishitem = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      packageId
    });

    if (!wishitem) {
      return res.status(404).json({ success: false, message: 'Item not in wishlist' });
    }

    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Check if package is in wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const { packageId } = req.params;

    const wishitem = await Wishlist.findOne({
      userId: req.user._id,
      packageId
    });

    res.json({ success: true, isInWishlist: !!wishitem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get count of wishlist items
exports.getWishlistCount = async (req, res) => {
  try {
    const count = await Wishlist.countDocuments({ userId: req.user._id });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
