const express = require('express');
const router = express.Router();
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getMyRestaurant,
  getNearbyRestaurants
} = require('../controllers/restaurant.controller');
const { protect } = require('../middleware/auth.middleware');
const { isOwner } = require('../middleware/role.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { validateRestaurant } = require('../middleware/validate.middleware');

router.get('/search', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/my-restaurant', protect, isOwner, getMyRestaurant);
router.get('/', getRestaurants);
router.get('/:slug', getRestaurant);
router.post('/', protect, isOwner, handleUpload('coverImage'), validateRestaurant, createRestaurant);
router.put('/:id', protect, isOwner, handleUpload('coverImage'), validateRestaurant, updateRestaurant);
router.delete('/:id', protect, isOwner, deleteRestaurant);

module.exports = router;