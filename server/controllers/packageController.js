const Package = require('../models/Package');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

// Get all active packages (public)
exports.getAllPackages = async (req, res) => {
  try {
    const { search, difficulty, minPrice, maxPrice, duration, sort, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (search) {
      filter.$text = { $search: search };
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (duration) {
      filter.duration = { $lte: Number(duration) };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { averageRating: -1 };
    else if (sort === 'duration') sortOption = { duration: 1 };

    const skip = (Number(page) - 1) * Number(limit);
    const packages = await Package.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Package.countDocuments(filter);

    res.json({
      success: true,
      packages,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single package
exports.getPackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create package (admin)
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create({ ...req.body, createdBy: req.user._id });
    
    // Send notifications to all users about the new package
    const users = await User.find({});
    users.forEach((user) => {
      createNotification(user._id, {
        type: 'package_added',
        title: '🎉 New Package Added',
        message: `Check out the new "${pkg.title}" package!`,
        icon: 'package',
        color: 'blue',
        data: {
          packageId: pkg._id,
        },
      });
    });

    res.status(201).json({ success: true, package: pkg, message: 'Package created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update package (admin)
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, package: pkg, message: 'Package updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete package (admin)
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
