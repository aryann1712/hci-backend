const express = require("express");
const createOrder = require("../controllers/orderController/createOrder");
const getOrderById = require("../controllers/orderController/getOrderById");
const getAllOrders = require("../controllers/orderController/getAllOrders");
const getAllOrdersByUserId = require("../controllers/orderController/getAllOrdersByUserId");
const updateOrderStatus = require("../controllers/orderController/updateOrderStatus");
const { protect, adminOnly, adminManagerOnly } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { createOrderSchema } = require("../validators/orderValidators");

const router = express.Router();

// Health check endpoint - no auth required
router.get("/health", (req, res) => {
  try {
    res.status(200).json({ 
      status: "ok",
      message: "Server is running",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: "error",
      message: "Server error during health check"
    });
  }
});

// Public routes
router.post("/", createOrder);

// Protected routes
router.get("/", protect, adminManagerOnly, getAllOrders);
router.get("/:orderId", protect, getOrderById);
router.put("/:orderId", protect, adminOnly, updateOrderStatus);
router.get("/userid/:id", protect, getAllOrdersByUserId);

module.exports = router;
