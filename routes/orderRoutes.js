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

// router.post("/", protect,  zodValidate(createOrderSchema), createOrder);
// router.get("/", protect, adminOnly, getAllOrders);
// router.get("/:orderId", protect, getOrderById);
// router.put("/:orderId", protect, adminOnly, updateOrderStatus);

router.post("/", createOrder);
router.get("/", protect, adminManagerOnly, getAllOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId", updateOrderStatus);
router.get("/userid/:id", protect, getAllOrdersByUserId);

module.exports = router;
