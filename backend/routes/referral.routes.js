const express = require('express');
const router = express.Router();
const {
  getMyReferralCode,
  applyReferralCode,
  getAllReferrals,
  getReferralLeaderboard
} = require('../controllers/referral.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.get('/leaderboard', getReferralLeaderboard);
router.get('/my-code', protect, getMyReferralCode);
router.post('/apply', protect, applyReferralCode);
router.get('/all', protect, isAdmin, getAllReferrals);

module.exports = router;
