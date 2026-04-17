const mongoose = require('mongoose');

const platformSettingsSchema = new mongoose.Schema({
  announcementBanner: {
    text: { type: String, default: '' },
    isActive: { type: Boolean, default: false },
    color: { type: String, default: '#ff6b00' }
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  },
  allowNewRegistrations: {
    type: Boolean,
    default: true
  },
  featuredRestaurants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant'
  }]
}, { timestamps: true });

module.exports = mongoose.model('PlatformSettings', platformSettingsSchema);