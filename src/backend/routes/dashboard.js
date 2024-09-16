// src/backend/routes/dashboard.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Sale = require('../models/Sale');
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/auth');
const logger = require('../Utils/logger');

router.use(authMiddleware);

router.get('/summary', async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalSales = await Sale.countDocuments();
    const totalRevenue = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    // const lowStockProducts = await Product.countDocuments({ "inventories.quantity": { $lte: 10 } });
    const lowStockProducts = await Product.find({ "inventories.quantity": { $lte: 10 } });
    logger.info(`Dashboard summary retrieved ${lowStockProducts}`);

    const summary = {
      totalProducts,
      totalSales,
      totalRevenue: totalRevenue[0]?.total || 0,
      lowStockProducts
    };

    res.json(summary);
    logger.info('Dashboard summary retrieved');
  } catch (error) {
    logger.error('Error retrieving dashboard summary:', error);
    next(error);
  }
});

module.exports = router;