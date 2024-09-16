// src/backend/routes/inventory.js
const express = require("express");
const router = express.Router();
const Inventory = require("../models/Inventory");
const paginationMiddleware = require("../middleware/pagination");
const logger = require("../Utils/logger");
const authMiddleware = require("../middleware/auth");
const Product = require("../models/Product");

router.use(authMiddleware);

// Create a new inventory
router.post("/createInventory", async (req, res, next) => {
  try {
    const inventory = new Inventory({
      name: req.body.name,
    });
    const newInventory = await inventory.save();
    res.status(201).json(newInventory);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "An inventory with this name already exists" });
    }
    next(error);
  }
});

//update Inventory
router.patch("/updateInventory", async (req, res, next) => {
  try {
    const inventoryId = req.query.id; // Access the ID from the query parameters
    const { name } = req.body;
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    const updatedInventory = await Inventory.findByIdAndUpdate(
      inventoryId,
      { name },
      { new: true }
    );
    if (!updatedInventory)
      return res.status(404).json({ message: "Inventory not found" });

    res.json(updatedInventory);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "An inventory with this name already exists" });
    }
    next(err);
  }
});

//delete Inventory
router.delete("/deleteInventory", async (req, res, next) => {
  try {
    // Access the ID from the query parameters and check if it exists
    const inventoryId = req.query.id;
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    // Find the id and delete the inventory if found
    const inventory = await Inventory.findByIdAndDelete(inventoryId);
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });

    // Remove this inventory from all products
    await Product.updateMany(
      { "inventories.inventory": inventoryId },
      { $pull: { inventories: { inventory: inventoryId } } }
    );

    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (err) {
    next(err);
  }
});

// Get all inventories
router.get(
  "/getAllInventories",
  paginationMiddleware,
  async (req, res, next) => {
    try {
      const { skip, limit } = req.pagination;
      const inventories = await Inventory.find().skip(skip).limit(limit);
      const total = await Inventory.countDocuments();
      res.json({
        inventories,
        currentPage: req.pagination.page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get a single inventory
router.get("/getInventory", async (req, res, next) => {
  try {
    const inventoryId = req.query.id; // Access the ID from the query parameters
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    const inventory = await Inventory.findById(inventoryId);
    if (!inventory)
      return res.status(404).json({ message: "Inventory not found" });
    res.json(inventory);
  } catch (err) {
    next(err);
  }
});

// Get products By Invertory
router.get("/getProductsByInventory", async (req, res, next) => {
  try {
    const inventoryId = req.query.id;
    if (!inventoryId) {
      return res.status(400).json({ message: "Inventory id is required" });
    }

    const products = await Product.find({
      "inventories.inventory": inventoryId,
    }).populate("supplier", "name");
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// Get low stock alerts for a specific inventory
router.get("/getLowStockAlerts", async (req, res, next) => {
  try {
    const inventoryId = req.query.id; // Access the ID from the query parameters
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    const lowStockThreshold = 10; // You can adjust this value or make it dynamic

    const lowStockProducts = await Product.find({
      inventory: inventoryId,
      quantity: { $lte: lowStockThreshold },
    }).populate("supplier", "name");

    res.json(lowStockProducts);
  } catch (err) {
    next(err);
  }
});

// Get total quantity of all products in an inventory
router.get("/getTotalQuantity", async (req, res, next) => {
  try {
    const inventoryId = req.query.id; // Access the ID from the query parameters
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    const result = await Product.aggregate([
      { $match: { inventory: mongoose.Types.ObjectId(inventoryId) } },
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } },
    ]);

    const totalQuantity = result.length > 0 ? result[0].totalQuantity : 0;

    res.json({ totalQuantity });
  } catch (err) {
    next(err);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const inventories = await Inventory.find({ name: { $regex: query, $options: 'i' } })
      .select('name');

    res.json(inventories);
    logger.info(`Searched inventories with query: ${query}`);
  } catch (error) {
    logger.error("Error searching inventories:", error);
    next(error);
  }
});

module.exports = router;
