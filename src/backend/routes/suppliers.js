// src/backend/routes/suppliers.js
const express = require("express");
const router = express.Router();
const Supplier = require("../models/Supplier");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");
const paginationMiddleware = require("../middleware/pagination");
const logger = require("../Utils/logger");

router.use(authMiddleware);

router.get("/search", async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: "Search query is required" });

    const suppliers = await Supplier.find({ name: { $regex: query, $options: 'i' } })
      .select('name contactPerson');

    res.json(suppliers);
    logger.info(`Searched suppliers with query: ${query}`);
  } catch (error) {
    logger.error("Error searching suppliers:", error);
    next(error);
  }
});

router.post("/addSupplier", async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;
    const supplier = new Supplier({
      name,
      contactPerson,
      email,
      phone,
      address,
    });
    await supplier.save();
    res.status(201).json(supplier);
    logger.info(`New supplier added: ${supplier.name}`);
  } catch (error) {
    logger.error("Error adding new supplier:", error);
    next(error);
  }
});

router.get("/getAllSuppliers", paginationMiddleware, async (req, res, next) => {
  try {
    const { skip, limit } = req.pagination;
    const suppliers = await Supplier.find()
      .skip(skip)
      .limit(limit)
      .populate("products");
    const total = await Supplier.countDocuments();

    res.json({
      suppliers,
      currentPage: req.pagination.page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    });
    logger.info(`Retrieved ${suppliers.length} suppliers`);
  } catch (error) {
    logger.error("Error retrieving suppliers:", error);
    next(error);
  }
});

router.get("/getSupplier", async (req, res, next) => {
  try {
    const supplierId = req.query.id; // Access the ID from the query parameters
    if (!supplierId)
      return res.status(400).json({ message: "Supplier ID is required" });

    const supplier = await Supplier.findById(supplierId).populate("products");
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
    logger.info(`Retrieved supplier: ${supplier.name}`);
  } catch (error) {
    logger.error("Error retrieving supplier:", error);
    next(error);
  }
});

router.patch("/updateSupplier", async (req, res, next) => {
  try {
    const supplierId = req.query.id; // Access the ID from the query parameters
    if (!supplierId)
      return res.status(400).json({ message: "Supplier ID is required" });

    const supplier = await Supplier.findByIdAndUpdate(supplierId, req.body, {
      new: true,
    });
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.json(supplier);
    logger.info(`Updated supplier: ${supplier.name}`);
  } catch (error) {
    logger.error("Error updating supplier:", error);
    next(error);
  }
});

router.delete("/deleteSupplier", async (req, res, next) => {
  try {
    const supplierId = req.query.id; // Access the ID from the query parameters
    if (!supplierId)
      return res.status(400).json({ message: "Supplier ID is required" });

    const supplier = await Supplier.findByIdAndDelete(supplierId);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    // Delete all products associated with this supplier
    await Product.deleteMany({ supplier: supplierId });

    res.json({
      message: "Supplier and associated products deleted successfully",
    });
    logger.info(`Deleted supplier: ${supplier.name}`);
  } catch (error) {
    logger.error("Error deleting supplier:", error);
    next(error);
  }
});

module.exports = router;
