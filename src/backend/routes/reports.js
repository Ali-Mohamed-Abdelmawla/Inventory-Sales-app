// src/backend/routes/reports.js
const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const logger = require("../Utils/logger");

router.use(authMiddleware);

router.get("/salesByDate", async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const sales = await Sale.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalSales: { $sum: { $toDouble: "$totalAmount" } }, // Convert to double if necessary
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(sales);
    logger.info(`Sales report generated from ${startDate} to ${endDate}`);
  } catch (error) {
    logger.error("Error generating sales report:", error);
    next(error);
  }
});

router.get("/topSellingProducts", async (req, res, next) => {
  try {
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" }, // Unwind the items array to treat each item as a separate document
      {
        $group: {
          _id: "$items.product", // Group by product ID
          totalQuantity: { $sum: "$items.quantity" }, // Sum the quantities for each product
        },
      },
      { $sort: { totalQuantity: -1 } }, // Sort by total quantity in descending order
      { $limit: 10 }, // Limit to the top 10 products
      {
        $lookup: {
          from: "products", // Look up product details from the products collection
          localField: "_id", // Match on the product ID
          foreignField: "_id",
          as: "productInfo",
        },
      },
      { $unwind: "$productInfo" }, // Unwind the productInfo array to extract the product details
      {
        $project: {
          _id: 0, // Exclude the _id from the final result
          productId: "$_id", // Include the product ID
          name: "$productInfo.name", // Include the product name
          price: "$productInfo.price", // Include the product price
          totalQuantity: 1, // Include the total quantity
          totalRevenue: { $multiply: ["$totalQuantity", "$productInfo.price"] }, // Calculate total revenue
        },
      },
    ]);

    res.json(topProducts);
    logger.info("Top selling products report generated");
  } catch (error) {
    logger.error("Error generating top selling products report:", error);
    next(error);
  }
});

module.exports = router;
