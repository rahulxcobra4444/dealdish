const Referral = require('../models/Referral');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');

// @desc    Get my referral code + stats
// @route   GET /api/referrals/my-code
const getMyReferralCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('referralCode referralCount name');

    const referrals = await Referral.find({ referrer: req.user._id })
      .populate('referred', 'name email createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Referral info', {
      referralCode: user.referralCode,
      totalReferrals: user.referralCount,
      referrals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply a referral code (after signup via code)
// @route   POST /api/referrals/apply
const applyReferralCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) return errorResponse(res, 400, 'Referral code is required');

    // Can't refer yourself
    const currentUser = await User.findById(req.user._id);
    if (currentUser.referralCode === code) {
      return errorResponse(res, 400, 'You cannot use your own referral code');
    }

    // Check if already referred
    if (currentUser.referredBy) {
      return errorResponse(res, 400, 'You have already used a referral code');
    }

    const referrer = await User.findOne({ referralCode: code });
    if (!referrer) {
      return errorResponse(res, 404, 'Invalid referral code');
    }

    // Create referral record
    const referral = await Referral.create({
      referrer: referrer._id,
      referred: req.user._id,
      referralCode: code,
      status: 'completed',
      rewardGiven: true
    });

    // Update both users
    currentUser.referredBy = referrer._id;
    await currentUser.save();

    referrer.referralCount += 1;
    await referrer.save();

    return successResponse(res, 200, 'Referral code applied successfully', { referral });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin — get all referrals
// @route   GET /api/referrals/all
const getAllReferrals = async (req, res, next) => {
  try {
    const referrals = await Referral.find()
      .populate('referrer', 'name email referralCode')
      .populate('referred', 'name email createdAt')
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'All referrals', {
      total: referrals.length,
      referrals
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get leaderboard (top referrers)
// @route   GET /api/referrals/leaderboard
const getReferralLeaderboard = async (req, res, next) => {
  try {
    const topReferrers = await User.find({ referralCount: { $gt: 0 } })
      .sort({ referralCount: -1 })
      .limit(10)
      .select('name referralCode referralCount');

    return successResponse(res, 200, 'Referral leaderboard', { leaderboard: topReferrers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyReferralCode,
  applyReferralCode,
  getAllReferrals,
  getReferralLeaderboard
};
