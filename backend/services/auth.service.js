const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d'
  });
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateReferralCode = (name) => {
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${name.substring(0, 3).toUpperCase()}${random}`;
};

const setTokenCookies = (res, accessToken, refreshToken) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
};

const clearTokenCookies = (res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const opts = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    expires: new Date(0),
  };
  res.cookie('accessToken', '', opts);
  res.cookie('refreshToken', '', opts);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateRandomToken,
  generateReferralCode,
  setTokenCookies,
  clearTokenCookies
};