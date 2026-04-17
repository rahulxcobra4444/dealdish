const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Offer = require('../models/Offer');
const Review = require('../models/Review');
const PlatformSettings = require('../models/PlatformSettings');
const RateLimitLog = require('../models/RateLimitLog');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { sendBroadcastEmail } = require('../services/email.service');

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    return successResponse(res, 200, 'Users fetched', { users });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }
    if (user.role === 'admin') {
      return errorResponse(res, 403, 'Cannot delete admin user');
    }
    await user.deleteOne();
    return successResponse(res, 200, 'User deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Verify restaurant
// @route   PATCH /api/admin/restaurants/:id/verify
const verifyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }
    restaurant.isVerified = true;
    await restaurant.save();
    return successResponse(res, 200, 'Restaurant verified', { restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Get unverified restaurants
// @route   GET /api/admin/restaurants/unverified
const getUnverifiedRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find({ isVerified: false })
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });
    return successResponse(res, 200, 'Unverified restaurants', { restaurants });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform stats
// @route   GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalRestaurants,
      totalOffers,
      totalReviews,
      verifiedRestaurants,
      activeOffers
    ] = await Promise.all([
      User.countDocuments(),
      Restaurant.countDocuments(),
      Offer.countDocuments(),
      Review.countDocuments(),
      Restaurant.countDocuments({ isVerified: true }),
      Offer.countDocuments({ isActive: true, isPaused: false })
    ]);

    return successResponse(res, 200, 'Platform stats', {
      stats: {
        totalUsers,
        totalRestaurants,
        totalOffers,
        totalReviews,
        verifiedRestaurants,
        activeOffers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Broadcast email to all users
// @route   POST /api/admin/broadcast
const broadcastEmail = async (req, res, next) => {
  try {
    const { subject, message, role } = req.body;
    if (!subject || !message) {
      return errorResponse(res, 400, 'Subject and message are required');
    }

    const filter = role ? { role } : {};
    const users = await User.find(filter).select('email');
    const emails = users.map(u => u.email);

    await sendBroadcastEmail(emails, subject, message);

    return successResponse(res, 200, `Email sent to ${emails.length} users`);
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform settings
// @route   GET /api/admin/settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = await PlatformSettings.create({});
    }
    return successResponse(res, 200, 'Settings fetched', { settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update platform settings
// @route   PATCH /api/admin/settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await PlatformSettings.findOne();
    if (!settings) {
      settings = await PlatformSettings.create(req.body);
    } else {
      settings = await PlatformSettings.findByIdAndUpdate(
        settings._id,
        req.body,
        { new: true, runValidators: true }
      );
    }
    return successResponse(res, 200, 'Settings updated', { settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get platform health dashboard (aggregated stats)
// @route   GET /api/admin/health
const getPlatformHealth = async (req, res, next) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      newUsersThisMonth,
      totalRestaurants,
      verifiedRestaurants,
      pendingVerification,
      totalOffers,
      activeOffers,
      expiredOffers,
      totalReviews,
      totalRedemptions,
      bannedIPs
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ isVerified: true }),
      Restaurant.countDocuments({ isVerified: false }),
      Offer.countDocuments(),
      Offer.countDocuments({ isActive: true, isPaused: false, validTill: { $gte: now } }),
      Offer.countDocuments({ $or: [{ isActive: false }, { validTill: { $lt: now } }] }),
      Review.countDocuments(),
      Offer.aggregate([{ $group: { _id: null, total: { $sum: '$redemptionCount' } } }]),
      RateLimitLog.countDocuments({ isBanned: true })
    ]);

    const redemptionTotal = totalRedemptions[0]?.total || 0;

    // Top 5 most redeemed offers
    const topOffers = await Offer.find()
      .sort({ redemptionCount: -1 })
      .limit(5)
      .populate('restaurant', 'name')
      .select('title redemptionCount viewCount');

    // New restaurants this month
    const newRestaurantsThisMonth = await Restaurant.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    return successResponse(res, 200, 'Platform health', {
      health: {
        users: { total: totalUsers, newThisMonth: newUsersThisMonth },
        restaurants: { total: totalRestaurants, verified: verifiedRestaurants, pending: pendingVerification, newThisMonth: newRestaurantsThisMonth },
        offers: { total: totalOffers, active: activeOffers, expired: expiredOffers, totalRedemptions: redemptionTotal },
        reviews: { total: totalReviews },
        security: { bannedIPs },
        topOffers
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get rate limit logs
// @route   GET /api/admin/rate-limits
const getRateLimitLogs = async (req, res, next) => {
  try {
    const { banned } = req.query;
    const filter = banned === 'true' ? { isBanned: true } : {};
    const logs = await RateLimitLog.find(filter).sort({ hitCount: -1 }).limit(100);
    return successResponse(res, 200, 'Rate limit logs', { logs });
  } catch (error) {
    next(error);
  }
};

// @desc    Unban an IP
// @route   PATCH /api/admin/rate-limits/:id/unban
const unbanIP = async (req, res, next) => {
  try {
    const log = await RateLimitLog.findById(req.params.id);
    if (!log) return errorResponse(res, 404, 'Log not found');
    log.isBanned = false;
    log.hitCount = 0;
    await log.save();
    return successResponse(res, 200, 'IP unbanned');
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer (admin)
// @route   DELETE /api/admin/offers/:id
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }
    await offer.deleteOne();
    return successResponse(res, 200, 'Offer deleted by admin');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  deleteUser,
  verifyRestaurant,
  getUnverifiedRestaurants,
  getStats,
  broadcastEmail,
  getSettings,
  updateSettings,
  deleteOffer,
  getPlatformHealth,
  getRateLimitLogs,
  unbanIP
};