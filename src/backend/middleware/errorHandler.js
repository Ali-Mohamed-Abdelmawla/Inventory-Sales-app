// src/backend/middleware/errorHandler.js
const logger = require('../Utils/logger');
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  
    res.status(err.status || 500).json({
      message: err.message || 'An unexpected error occurred',
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  };
  
  module.exports = errorHandler;