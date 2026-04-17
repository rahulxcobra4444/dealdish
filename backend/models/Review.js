const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    maxlength: [500, 'Comment cannot exceed 500 characters']
  },
  ownerReply: {
    type: String,
    maxlength: [300, 'Reply cannot exceed 300 characters']
  },
  ownerRepliedAt: Date,
  isVisible: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

reviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });
reviewSchema.index({ restaurant: 1, isVisible: 1 });

module.exports = mongoose.model('Review', reviewSchema);