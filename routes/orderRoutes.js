const express = require("express");
const createOrder = require("../controllers/orderController/createOrder");
const getOrderById = require("../controllers/orderController/getOrderById");
const getAllOrders = require("../controllers/orderController/getAllOrders");
const updateOrderStatus = require("../controllers/orderController/updateOrderStatus");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create an inquiry/order
router.post("/", protect, createOrder);

// Get a single order
router.get("/:orderId", protect, getOrderById);

// Admin routes
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;
