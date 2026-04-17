const express = require('express');
const router = express.Router();
const {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
  getNearbyOffers,
  redeemOffer,
  bulkManageOffers
} = require('../controllers/offer.controller');
const { protect } = require('../middleware/auth.middleware');
const { isOwner } = require('../middleware/role.middleware');
const { handleUpload } = require('../middleware/upload.middleware');
const { validateOffer } = require('../middleware/validate.middleware');

router.get('/nearby', getNearbyOffers);
router.get('/', getOffers);
router.get('/:id', getOffer);
router.post('/', protect, isOwner, handleUpload('image'), validateOffer, createOffer);
router.put('/:id', protect, isOwner, handleUpload('image'), validateOffer, updateOffer);
router.delete('/:id', protect, isOwner, deleteOffer);
router.patch('/:id/toggle', protect, isOwner, toggleOffer);
router.post('/:id/redeem', protect, redeemOffer);
router.post('/bulk', protect, isOwner, bulkManageOffers);

module.exports = router;