// src/backend/routes/receipts.js
const express = require("express");
const router = express.Router();
const Receipt = require("../models/Receipt");
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Inventory = require("../models/Inventory");
const authMiddleware = require("../middleware/auth");
const paginationMiddleware = require("../middleware/pagination");
const logger = require("../Utils/logger");

router.use(authMiddleware);

// Add a new receipt
router.post("/addReceipt", async (req, res, next) => {
  try {
    const { supplierId, inventoryId, items, notes } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

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
        product.inventories.push({
          inventory: inventoryId,
          quantity: item.quantity,
        });
      } else {
        product.inventories[inventoryIndex].quantity += item.quantity;
      }
      await product.save();

      totalAmount += item.quantity * product.price;
    }

    const receipt = new Receipt({
      supplier: supplierId,
      inventory: inventoryId,
      items,
      totalAmount,
      notes,
    });

    const newReceipt = await receipt.save();
    res.status(201).json(newReceipt);
    logger.info(`New receipt added for supplier: ${supplier.name}`);
  } catch (error) {
    logger.error("Error adding new receipt:", error);
    next(error);
  }
});

// Get all receipts
router.get("/getAllReceipts", paginationMiddleware, async (req, res, next) => {
  try {
    const { skip, limit } = req.pagination;
    const receipts = await Receipt.find()
      .skip(skip)
      .limit(limit)
      .populate("supplier inventory items.product");
    const total = await Receipt.countDocuments();

    res.json({
      receipts,
      currentPage: req.pagination.page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
    logger.info(`Retrieved ${receipts.length} receipts`);
  } catch (error) {
    logger.error("Error retrieving receipts:", error);
    next(error);
  }
});

// Get a single receipt
router.get("/getReceipt", async (req, res, next) => {
  try {
    const receiptId = req.query.id;
    if (!receiptId)
      return res.status(400).json({ message: "Receipt ID is required" });

    const receipt = await Receipt.findById(receiptId).populate(
      "supplier inventory items.product"
    );
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });
    res.json(receipt);
    logger.info(`Retrieved receipt: ${receipt._id}`);
  } catch (error) {
    logger.error("Error retrieving receipt:", error);
    next(error);
  }
});

module.exports = router;
