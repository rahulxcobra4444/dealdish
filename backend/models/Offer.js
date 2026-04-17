const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Offer title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Offer description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  discountType: {
    type: String,
    enum: ['percentage', 'flat', 'bogo', 'freeitem'],
    required: true
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  offerPrice: {
    type: Number,
    min: 0
  },
  image: {
    type: String,
    default: ''
  },
  validFrom: {
    type: Date,
    required: true
  },
  validTill: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  redemptionCount: {
    type: Number,
    default: 0
  },
  maxRedemptions: {
    type: Number,
    default: null
  },
  viewCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  termsAndConditions: {
    type: String,
    maxlength: [300, 'Terms cannot exceed 300 characters']
  }
}, { timestamps: true });

offerSchema.index({ restaurant: 1, isActive: 1 });
offerSchema.index({ validTill: 1 });
offerSchema.index({ isActive: 1, isPaused: 1 });

module.exports = mongoose.model('Offer', offerSchema);