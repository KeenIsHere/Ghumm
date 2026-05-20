const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, trim: true },
  homeSliderImages: [{
    url: { type: String, required: true },
    order: { type: Number, default: 0 },
  }],
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', siteSettingSchema);