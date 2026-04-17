const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  }
}, { timestamps: true });

bookmarkSchema.index({ user: 1, restaurant: 1 }, { unique: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);