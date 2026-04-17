const Review = require('../models/Review');
const Restaurant = require('../models/Restaurant');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { paginate, paginateResponse } = require('../utils/pagination');

// @desc    Create a review
// @route   POST /api/reviews/:restaurantId
const createReview = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { rating, comment } = req.body;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    // One review per user per restaurant
    const existing = await Review.findOne({ restaurant: restaurantId, user: req.user._id });
    if (existing) {
      return errorResponse(res, 400, 'You have already reviewed this restaurant');
    }

    const review = await Review.create({
      restaurant: restaurantId,
      user: req.user._id,
      rating,
      comment
    });

    // Recalculate restaurant rating
    const allReviews = await Review.find({ restaurant: restaurantId, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    restaurant.rating = Math.round(avgRating * 10) / 10;
    restaurant.reviewCount = allReviews.length;
    await restaurant.save();

    await review.populate('user', 'name avatar');

    return successResponse(res, 201, 'Review submitted successfully', { review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for a restaurant
// @route   GET /api/reviews/:restaurantId
const getReviews = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;
    const { page, limit } = req.query;
    const { skip, limit: limitNum, page: pageNum } = paginate({}, page, limit);

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    const filter = { restaurant: restaurantId, isVisible: true };
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
      .populate('user', 'name avatar')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Reviews fetched',
      paginateResponse(reviews, pageNum, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Update own review
// @route   PUT /api/reviews/:id
const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Not authorized to update this review');
    }

    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    // Recalculate restaurant rating
    const allReviews = await Review.find({ restaurant: review.restaurant, isVisible: true });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await Restaurant.findByIdAndUpdate(review.restaurant, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    await review.populate('user', 'name avatar');
    return successResponse(res, 200, 'Review updated', { review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own review (or admin)
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return errorResponse(res, 403, 'Not authorized to delete this review');
    }

    const restaurantId = review.restaurant;
    await review.deleteOne();

    // Recalculate restaurant rating
    const allReviews = await Review.find({ restaurant: restaurantId, isVisible: true });
    const avgRating = allReviews.length
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length
    });

    return successResponse(res, 200, 'Review deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Owner replies to a review
// @route   POST /api/reviews/:id/reply
const replyToReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate('restaurant');
    if (!review) {
      return errorResponse(res, 404, 'Review not found');
    }

    if (review.restaurant.owner.toString() !== req.user._id.toString()) {
      return errorResponse(res, 403, 'Only the restaurant owner can reply to reviews');
    }

    const { reply } = req.body;
    if (!reply || !reply.trim()) {
      return errorResponse(res, 400, 'Reply text is required');
    }

    review.ownerReply = reply.trim();
    review.ownerRepliedAt = new Date();
    await review.save();

    await review.populate('user', 'name avatar');
    return successResponse(res, 200, 'Reply added', { review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my review for a restaurant
// @route   GET /api/reviews/:restaurantId/my-review
const getMyReview = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      restaurant: req.params.restaurantId,
      user: req.user._id
    }).populate('user', 'name avatar');

    if (!review) {
      return errorResponse(res, 404, 'You have not reviewed this restaurant yet');
    }

    return successResponse(res, 200, 'Your review', { review });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
  replyToReview,
  getMyReview
};
