// src/backend/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Supplier = require("../models/Supplier");
const Inventory = require("../models/Inventory");
const authMiddleware = require("../middleware/auth");
const paginationMiddleware = require("../middleware/pagination");
const logger = require("../Utils/logger");

router.use(authMiddleware);

// Get all products
router.get("/getAllProducts", paginationMiddleware, async (req, res, next) => {
  try {
    const { skip, limit } = req.pagination;

    const products = await Product.find()
      .skip(skip)
      .limit(limit)
      .populate("supplier inventories.inventory");
    const total = await Product.countDocuments();
    res.json({
      products,
      currentPage: req.pagination.page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
  } catch (err) {
    next(err);
  }
});

// Get a single product
router.get("/getProduct", async (req, res, next) => {
  try {
    const productId = req.query.id; // Access the ID from the query parameters
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findById(productId).populate(
      "supplier inventories.inventory"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Add a product
router.post("/addProduct", async (req, res, next) => {
  try {
    const { name, price, supplierId, inventories } = req.body;

    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    const resolvedInventories = await Promise.all(
      inventories.map(async (inv) => {
        const inventory = await Inventory.findById(inv.inventory);
        if (!inventory) {
          return res.status(400).json({
            message: `InventoryManager with id ${inv.inventory} not found`,
          });
        }
        return { inventory: inv.inventory, quantity: inv.quantity };
      })
    );

    const product = new Product({
      name,
      price,
      supplier: supplierId,
      inventories: resolvedInventories,
    });

    const newProduct = await product.save();
    supplier.products.push(newProduct._id);
    await supplier.save();
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// Get products by inventory
router.get("/getProductsByInventory", async (req, res, next) => {
  try {
    const inventoryId = req.query.id; // Access the ID from the query parameters
    if (!inventoryId)
      return res.status(400).json({ message: "Inventory ID is required" });

    const products = await Product.find({ inventory: inventoryId })
      .populate("supplier", "name")
      .populate("inventory", "name");
    res.json(products);
  } catch (error) {
    next(error);
  }
});

//search a product
router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query)
      return res.status(400).json({ message: "Search query is required" });

    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    }).select("name price");

    res.json(products);
    logger.info(`Searched product with query: ${query}`);
  } catch (error) {
    logger.error("Error searching product:", error);
    next(error);
  }
});

// Update a product
router.patch("/updateProduct", async (req, res, next) => {
  try {
    const { name, price, supplierId, inventories } = req.body;

    const productId = req.query.id;
    if (!productId) {
      return res.status(400).json({ message: "Product ID is required" });
    }

    // Validate if supplier exists
    const newSupplier = await Supplier.findById(supplierId);
    if (!newSupplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Resolve inventories
    const resolvedInventories = await Promise.all(
      inventories.map(async (inv) => {
        const inventory = await Inventory.findById(inv.inventory);
        if (!inventory) {
          throw new Error(`Inventory with id ${inv.inventory} not found`);
        }
        return { inventory: inv.inventory, quantity: inv.quantity };
      })
    );

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the supplier relationship if it has changed
    if (product.supplier.toString() !== supplierId) {
      // Remove from old supplier
      await Supplier.updateOne(
        { _id: product.supplier },
        { $pull: { products: product._id } }
      );

      // Add to new supplier
      newSupplier.products.push(product._id);
      await newSupplier.save();
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        name,
        price,
        supplier: supplierId,
        inventories: resolvedInventories,
      },
      { new: true } // Return the updated document
    );

    res.json(updatedProduct);
  } catch (err) {
    next(err);
  }
});

// Delete a product
router.delete("/deleteProduct", async (req, res, next) => {
  try {
    const productId = req.query.id; // Access the ID from the query parameters
    if (!productId)
      return res.status(400).json({ message: "Product ID is required" });

    const product = await Product.findByIdAndDelete(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await Supplier.updateOne(
      { _id: product.supplier },
      { $pull: { products: product._id } }
    );

    res.json({ message: "Product deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
