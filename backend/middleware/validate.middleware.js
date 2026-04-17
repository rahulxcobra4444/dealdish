const Joi = require('joi');
const { errorResponse } = require('../utils/apiResponse');

const validateRestaurant = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(100).required(),
    description: Joi.string().max(500).optional(),
    cuisine: Joi.array().items(Joi.string()).optional(),
    address: Joi.object({
      street: Joi.string().optional(),
      city: Joi.string().optional(),
      state: Joi.string().optional(),
      pincode: Joi.string().optional()
    }).optional(),
    phone: Joi.string().optional(),
    email: Joi.string().email().optional(),
    website: Joi.string().optional(),
    priceRange: Joi.string().valid('budget', 'moderate', 'expensive').optional(),
    openingHours: Joi.object().optional(),
    location: Joi.object().optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return errorResponse(res, 400, message);
  }
  next();
};

const validateOffer = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().max(100).required(),
    description: Joi.string().max(500).required(),
    discountType: Joi.string().valid('percentage', 'flat', 'bogo', 'freeitem').required(),
    discountValue: Joi.number().min(0).required(),
    originalPrice: Joi.number().min(0).optional(),
    offerPrice: Joi.number().min(0).optional(),
    validFrom: Joi.date().required(),
    validTill: Joi.date().required(),
    tags: Joi.array().items(Joi.string()).optional(),
    termsAndConditions: Joi.string().max(300).optional(),
    maxRedemptions: Joi.number().optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return errorResponse(res, 400, message);
  }
  next();
};

const validateLogin = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return errorResponse(res, 400, message);
  }
  next();
};

const validateSignup = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('customer', 'owner').optional(),
    referralCode: Joi.string().optional()
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(', ');
    return errorResponse(res, 400, message);
  }
  next();
};

module.exports = { validateRestaurant, validateOffer, validateLogin, validateSignup };