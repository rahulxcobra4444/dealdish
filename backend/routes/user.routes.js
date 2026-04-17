const express = require('express');
const router = express.Router();
const {
  getBookmarks,
  toggleBookmark,
  getDashboardStats,
  updateProfile
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/bookmarks', getBookmarks);
router.post('/bookmarks/:restaurantId', toggleBookmark);
router.get('/dashboard', getDashboardStats);
router.put('/profile', updateProfile);

module.exports = router;