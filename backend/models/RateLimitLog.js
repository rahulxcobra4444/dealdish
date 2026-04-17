const mongoose = require('mongoose');

const rateLimitLogSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  endpoint: {
    type: String,
    required: true
  },
  hitCount: {
    type: Number,
    default: 1
  },
  lastHit: {
    type: Date,
    default: Date.now
  },
  isBanned: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

rateLimitLogSchema.index({ ip: 1, endpoint: 1 });

module.exports = mongoose.model('RateLimitLog', rateLimitLogSchema);