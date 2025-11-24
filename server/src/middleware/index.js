/**
 * Middleware Index
 * Centralized middleware exports
 */

const { protect, authorize } = require('./auth');
const errorHandler = require('./errorHandler');
const notFound = require('./notFound');

module.exports = {
  protect,
  authorize,
  errorHandler,
  notFound,
};

