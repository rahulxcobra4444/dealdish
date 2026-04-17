const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Offer = require('../models/Offer');
const Bookmark = require('../models/Bookmark');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get user bookmarks
// @route   GET /api/users/bookmarks
const getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('restaurant', 'name slug coverImage address cuisine rating')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Bookmarks fetched', { bookmarks });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or remove bookmark
// @route   POST /api/users/bookmarks/:restaurantId
const toggleBookmark = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    const existing = await Bookmark.findOne({
      user: req.user._id,
      restaurant: restaurantId
    });

    if (existing) {
      await existing.deleteOne();
      return successResponse(res, 200, 'Bookmark removed');
    }

    await Bookmark.create({ user: req.user._id, restaurant: restaurantId });
    return successResponse(res, 201, 'Bookmark added');
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner dashboard stats
// @route   GET /api/users/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return successResponse(res, 200, 'No restaurant yet', { stats: null });
    }

    const offers = await Offer.find({ restaurant: restaurant._id });

    const totalOffers = offers.length;
    const activeOffers = offers.filter(o => o.isActive && !o.isPaused).length;
    const totalRedemptions = offers.reduce((sum, o) => sum + o.redemptionCount, 0);
    const totalViews = offers.reduce((sum, o) => sum + o.viewCount, 0);

    return successResponse(res, 200, 'Dashboard stats', {
      stats: {
        restaurant: {
          name: restaurant.name,
          isVerified: restaurant.isVerified,
          rating: restaurant.rating,
          reviewCount: restaurant.reviewCount
        },
        totalOffers,
        activeOffers,
        totalRedemptions,
        totalViews,
        offers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'Profile updated', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode,
        avatar: user.avatar,
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBookmarks,
  toggleBookmark,
  getDashboardStats,
  updateProfile
};