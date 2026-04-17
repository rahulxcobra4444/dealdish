const Restaurant = require('../models/Restaurant');
const { successResponse, errorResponse } = require('../utils/apiResponse');
const { generateUniqueSlug } = require('../utils/slugify');
const { paginate, paginateResponse } = require('../utils/pagination');
const { uploadToCloudinary } = require('../middleware/upload.middleware');

// @desc    Create restaurant
// @route   POST /api/restaurants
const createRestaurant = async (req, res, next) => {
  try {
    const existing = await Restaurant.findOne({ owner: req.user._id });
    if (existing) {
      return errorResponse(res, 400, 'You already have a restaurant registered');
    }

    const slug = await generateUniqueSlug(req.body.name, Restaurant);
    const imageUrl = req.imageUrl || '';

    const restaurant = await Restaurant.create({
      ...req.body,
      slug,
      owner: req.user._id,
      coverImage: imageUrl
    });

    return successResponse(res, 201, 'Restaurant created successfully', { restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all restaurants
// @route   GET /api/restaurants
const getRestaurants = async (req, res, next) => {
  try {
    const { page, limit, cuisine, priceRange, verified } = req.query;
    const { skip, limit: limitNum, page: pageNum } = paginate({}, page, limit);

    const filter = { isActive: true };
    if (cuisine) filter.cuisine = { $in: [cuisine] };
    if (priceRange) filter.priceRange = priceRange;
    if (verified) filter.isVerified = verified === 'true';

    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .populate('owner', 'name email')
      .skip(skip)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return successResponse(res, 200, 'Restaurants fetched', 
      paginateResponse(restaurants, pageNum, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant by slug
// @route   GET /api/restaurants/:slug
const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ slug: req.params.slug })
      .populate('owner', 'name email');

    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    return successResponse(res, 200, 'Restaurant fetched', { restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to update this restaurant');
    }

    if (req.imageUrl) req.body.coverImage = req.imageUrl;

    if (req.body.name && req.body.name !== restaurant.name) {
      req.body.slug = await generateUniqueSlug(req.body.name, Restaurant, req.params.id);
    }

    restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return successResponse(res, 200, 'Restaurant updated', { restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return errorResponse(res, 404, 'Restaurant not found');
    }

    if (restaurant.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Not authorized to delete this restaurant');
    }

    await restaurant.deleteOne();
    return successResponse(res, 200, 'Restaurant deleted');
  } catch (error) {
    next(error);
  }
};

// @desc    Search restaurants
// @route   GET /api/restaurants/search
const searchRestaurants = async (req, res, next) => {
  try {
    const { q, page, limit } = req.query;
    if (!q) {
      return errorResponse(res, 400, 'Search query is required');
    }

    const { skip, limit: limitNum, page: pageNum } = paginate({}, page, limit);

    const filter = {
      isActive: true,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { cuisine: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    const total = await Restaurant.countDocuments(filter);
    const restaurants = await Restaurant.find(filter)
      .skip(skip)
      .limit(limitNum)
      .sort({ rating: -1 });

    return successResponse(res, 200, 'Search results',
      paginateResponse(restaurants, pageNum, limitNum, total));
  } catch (error) {
    next(error);
  }
};

// @desc    Get my restaurant (owner)
// @route   GET /api/restaurants/my-restaurant
const getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return errorResponse(res, 404, 'You do not have a restaurant yet');
    }
    return successResponse(res, 200, 'Your restaurant', { restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
const getNearbyRestaurants = async (req, res, next) => {
  try {
    const { lng, lat, distance = 5000 } = req.query;

    if (!lng || !lat) {
      return errorResponse(res, 400, 'Longitude and latitude are required');
    }

    const restaurants = await Restaurant.find({
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
    }).limit(20);

    return successResponse(res, 200, 'Nearby restaurants', { restaurants });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  searchRestaurants,
  getMyRestaurant,
  getNearbyRestaurants
};