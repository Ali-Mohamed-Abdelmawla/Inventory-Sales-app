// src/backend/routes/sales.js
const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");
const Product = require("../models/Product");
const Inventory = require("../models/Inventory");
const authMiddleware = require("../middleware/auth");
const paginationMiddleware = require("../middleware/pagination");
const logger = require("../Utils/logger");

router.use(authMiddleware);

// Add a new sale
router.post("/addSale", async (req, res, next) => {
  try {
    const { inventoryId, items, notes } = req.body;

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res
          .status(404)
          .json({ message: `Product not found: ${item.product}` });
      }

      // Update product quantity in the specific inventory
      const inventoryIndex = product.inventories.findIndex(
        (inv) => inv.inventory.toString() === inventoryId
      );
      if (inventoryIndex === -1) {
        return res
          .status(400)
          .json({
            message: `Product not found in the specified inventory: ${item.product}`,
          });
      }
      if (product.inventories[inventoryIndex].quantity < item.quantity) {
        return res
          .status(400)
          .json({
            message: `Insufficient quantity for product: ${product.name}`,
          });
      }
      product.inventories[inventoryIndex].quantity -= item.quantity;
      await product.save();

      totalAmount += item.quantity * product.price;
    }

    const sale = new Sale({
      inventory: inventoryId,
      items,
      totalAmount,
      notes,
    });

    const newSale = await sale.save();
    res.status(201).json(newSale);
    logger.info(`New sale added for inventory: ${inventory.name}`);
  } catch (error) {
    logger.error("Error adding new sale:", error);
    next(error);
  }
});

// Get all sales
router.get("/getAllSales", paginationMiddleware, async (req, res, next) => {
  try {
    const { skip, limit } = req.pagination;
    const sales = await Sale.find()
      .skip(skip)
      .limit(limit)
      .populate("inventory items.product");
    const total = await Sale.countDocuments();

    res.json({
      sales,
      currentPage: req.pagination.page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
    logger.info(`Retrieved ${sales.length} sales`);
  } catch (error) {
    logger.error("Error retrieving sales:", error);
    next(error);
  }
});

// Get a single sale
router.get("/getSale", async (req, res, next) => {
  try {
    const saleId = req.query.id;
    if (!saleId)
      return res.status(400).json({ message: "Sale ID is required" });

    const sale = await Sale.findById(saleId).populate(
      "inventory items.product"
    );
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.json(sale);
    logger.info(`Retrieved sale: ${sale._id}`);
  } catch (error) {
    logger.error("Error retrieving sale:", error);
    next(error);
  }
});

module.exports = router;
