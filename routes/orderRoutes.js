const express = require("express");
const createOrder = require("../controllers/orderController/createOrder");
const getOrderById = require("../controllers/orderController/getOrderById");
const getAllOrders = require("../controllers/orderController/getAllOrders");
const updateOrderStatus = require("../controllers/orderController/updateOrderStatus");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getAllOrders);
router.get("/:orderId", protect, getOrderById);
router.put("/:orderId", protect, adminOnly, updateOrderStatus);

module.exports = router;
