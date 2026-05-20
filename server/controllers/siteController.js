const SiteSetting = require('../models/SiteSetting');

const HOME_SLIDER_KEY = 'home-slider';

const normalizeImages = (images = []) => {
  return images
    .filter((image) => image && image.url)
    .map((image, index) => ({
      url: image.url,
      order: Number.isFinite(image.order) ? image.order : index,
    }))
    .sort((a, b) => a.order - b.order);
};

exports.getHomeSlider = async (req, res) => {
  try {
    const setting = await SiteSetting.findOne({ key: HOME_SLIDER_KEY }).lean();

    res.json({
      success: true,
      images: setting?.homeSliderImages || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateHomeSlider = async (req, res) => {
  try {
    const { images } = req.body;

    if (!Array.isArray(images)) {
      return res.status(400).json({ success: false, message: 'Images must be an array' });
    }

    const normalizedImages = normalizeImages(images);

    const setting = await SiteSetting.findOneAndUpdate(
      { key: HOME_SLIDER_KEY },
      {
        key: HOME_SLIDER_KEY,
        homeSliderImages: normalizedImages,
        updatedBy: req.user._id,
      },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    res.json({
      success: true,
      images: setting.homeSliderImages,
      message: 'Homepage slider updated successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};