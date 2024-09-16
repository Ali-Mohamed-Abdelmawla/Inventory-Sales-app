const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const productRoutes = require("./routes/products");
const saleRoutes = require("./routes/sales");
const inventoryRoutes = require('./routes/inventory');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const supplierRoutes = require('./routes/suppliers');
const reportRoutes = require('./routes/reports');
const receiptRoutes = require('./routes/receipts');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const errorHandler = require('./middleware/errorHandler');
const logger = require("./Utils/logger");

const app = express();
const PORT = process.env.PORT || 5000;

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

// app.use(helmet());
// app.use(limiter);
// Middleware
app.use(
  cors({
    origin: "http://localhost:8080", // Allow requests from your Electron app
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/inventory_sales_app")
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("MongoDB connection error:", err));

// Routes (we'll add these later)
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/receipts', receiptRoutes);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

module.exports = app;
