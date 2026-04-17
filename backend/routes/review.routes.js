const express = require('express');
const router = express.Router();
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  replyToReview,
  getMyReview
} = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { isOwner } = require('../middleware/role.middleware');

// Public
router.get('/:restaurantId', getReviews);

// Protected
router.post('/:restaurantId', protect, createReview);
router.get('/:restaurantId/my-review', protect, getMyReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.post('/:id/reply', protect, isOwner, replyToReview);

module.exports = router;
