const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

router.use(protect, isAdmin);

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/restaurants/unverified', getUnverifiedRestaurants);
router.patch('/restaurants/:id/verify', verifyRestaurant);
router.get('/stats', getStats);
router.get('/health', getPlatformHealth);
router.post('/broadcast', broadcastEmail);
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.delete('/offers/:id', deleteOffer);
router.get('/rate-limits', getRateLimitLogs);
router.patch('/rate-limits/:id/unban', unbanIP);

module.exports = router;
