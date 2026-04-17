const { errorResponse } = require('../utils/apiResponse');

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied. Admins only.');
};

const isOwner = (req, res, next) => {
  if (req.user && (req.user.role === 'owner' || req.user.role === 'admin')) {
    return next();
  }
  return errorResponse(res, 403, 'Access denied. Restaurant owners only.');
};

const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === 'customer') {
    return next();
  }
  return errorResponse(res, 403, 'Access denied. Customers only.');
};

module.exports = { isAdmin, isOwner, isCustomer };