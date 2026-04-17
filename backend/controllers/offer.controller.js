const Offer = require('../models/Offer');
const Restaurant = require('../models/Restaurant');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { paginate, paginateResponse } = require('../utils/pagination');

// @desc    Create offer
// @route   POST /api/offers
const createOffer = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return errorResponse(res, 404, 'You do not have a restaurant');
    }

    if (!restaurant.isVerified) {
      return errorResponse(res, 403, 'Your restaurant must be verified before adding offers');
    }

    const imageUrl = req.imageUrl || '';
    const offer = await Offer.create({
      ...req.body,
      restaurant: restaurant._id,
      image: imageUrl
    });

    return successResponse(res, 201, 'Offer created successfully', { offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all offers
// @route   GET /api/offers
const getOffers = async (req, res, next) => {
  try {
    const { page, limit, discountType, restaurant } = req.query;
    const { skip, limit: limitNum, page: pageNum } = paginate({}, page, limit);

    const filter = { isActive: true, isPaused: false };
    if (discountType) filter.discountType = discountType;
    if (restaurant) filter.restaurant = restaurant;

    filter.validTill = { $gte: new Date() };

    const total = await Offer.countDocuments(filter);
    const offers = await Offer.find(filter)
      .populate('restaurant', 'name slug coverImage address cuisine')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Offers fetched',
      paginateResponse(offers, pageNum, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single offer
// @route   GET /api/offers/:id
const getOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('restaurant', 'name slug coverImage address phone cuisine rating');

    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    offer.viewCount += 1;
    await offer.save();

    return successResponse(res, 200, 'Offer fetched', { offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
const updateOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('restaurant');

    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    if (offer.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this offer');
    }

    if (req.imageUrl) req.body.image = req.imageUrl;

    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return successResponse(res, 200, 'Offer updated', { offer: updatedOffer });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
const deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('restaurant');

    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    if (offer.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this offer');
    }

    await offer.deleteOne();
    return successResponse(res, 200, 'Offer deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Pause or resume offer
// @route   PATCH /api/offers/:id/toggle
const toggleOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id)
      .populate('restaurant');

    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    if (offer.restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized');
    }

    offer.isPaused = !offer.isPaused;
    await offer.save();

    return successResponse(res, 200, `Offer ${offer.isPaused ? 'paused' : 'resumed'}`, { offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby offers
// @route   GET /api/offers/nearby
const getNearbyOffers = async (req, res, next) => {
  try {
    const { lng, lat, distance = 5000 } = req.query;

    if (!lng || !lat) {
      return errorResponse(res, 400, 'Longitude and latitude are required');
    }

    const nearbyRestaurants = await Restaurant.find({
      isActive: true,
      isVerified: true,
      location: {
        $nearSphere: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(distance)
        }
      }
    }).select('_id');

    const restaurantIds = nearbyRestaurants.map(r => r._id);

    const offers = await Offer.find({
      restaurant: { $in: restaurantIds },
      isActive: true,
      isPaused: false,
      validTill: { $gte: new Date() }
    })
      .populate('restaurant', 'name slug coverImage address cuisine rating')
      .limit(20)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Nearby offers', { offers });
  } catch (error) {
    next(error);
  }
};

// @desc    Redeem offer
// @route   POST /api/offers/:id/redeem
const redeemOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return errorResponse(res, 404, 'Offer not found');
    }

    if (!offer.isActive || offer.isPaused) {
      return errorResponse(res, 400, 'Offer is not active');
    }

    if (offer.validTill < new Date()) {
      return errorResponse(res, 400, 'Offer has expired');
    }

    if (offer.maxRedemptions && offer.redemptionCount >= offer.maxRedemptions) {
      return errorResponse(res, 400, 'Offer redemption limit reached');
    }

    offer.redemptionCount += 1;
    await offer.save();

    return successResponse(res, 200, 'Offer redeemed successfully', { offer });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk manage offers (pause/resume/delete multiple)
// @route   POST /api/offers/bulk
const bulkManageOffers = async (req, res, next) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return errorResponse(res, 400, 'Provide an array of offer IDs');
    }

    if (!['pause', 'resume', 'delete'].includes(action)) {
      return errorResponse(res, 400, 'Action must be pause, resume, or delete');
    }

    // Verify all offers belong to this owner's restaurant
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return errorResponse(res, 404, 'You do not have a restaurant');
    }

    const offers = await Offer.find({ _id: { $in: ids }, restaurant: restaurant._id });
    if (offers.length !== ids.length) {
      return errorResponse(res, 403, 'Some offers do not belong to your restaurant');
    }

    let result;
    if (action === 'delete') {
      result = await Offer.deleteMany({ _id: { $in: ids }, restaurant: restaurant._id });
      return successResponse(res, 200, `${result.deletedCount} offers deleted`);
    }

    const update = action === 'pause' ? { isPaused: true } : { isPaused: false };
    result = await Offer.updateMany({ _id: { $in: ids }, restaurant: restaurant._id }, update);

    return successResponse(res, 200, `${result.modifiedCount} offers ${action}d`);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOffer,
  getOffers,
  getOffer,
  updateOffer,
  deleteOffer,
  toggleOffer,
  getNearbyOffers,
  redeemOffer,
  bulkManageOffers
};