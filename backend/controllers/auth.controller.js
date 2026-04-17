const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const {
  generateAccessToken,
  generateRefreshToken,
  generateRandomToken,
  generateReferralCode,
  setTokenCookies,
  clearTokenCookies
} = require('../services/auth.service');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/signup
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, referralCode } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, 400, 'Email already registered');
    }

    const allowedRoles = ['customer', 'owner'];
    const userRole = allowedRoles.includes(role) ? role : 'customer';

    const referral = generateReferralCode(name);

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
      referralCode: referral,
      isVerified: true
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        await user.save();
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokenCookies(res, accessToken, refreshToken);

    return successResponse(res, 201, 'Account created successfully', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokenCookies(res, accessToken, refreshToken);

    return successResponse(res, 200, 'Login successful', {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        referralCode: user.referralCode
      },
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    clearTokenCookies(res);
    return successResponse(res, 200, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return errorResponse(res, 404, 'User not found');
    return successResponse(res, 200, 'User fetched', {
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

// @desc    Refresh access token
// @route   POST /api/auth/refresh
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) {
      return errorResponse(res, 401, 'No refresh token');
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, 401, 'User not found');
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    setTokenCookies(res, accessToken, refreshToken);

    return successResponse(res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, 'No user with that email');
    }

    const resetToken = generateRandomToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    return successResponse(res, 200, 'Password reset token generated', {
      resetToken
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return errorResponse(res, 400, 'Invalid or expired reset token');
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return successResponse(res, 200, 'Password reset successful');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  getMe,
  refreshToken,
  forgotPassword,
  resetPassword
};