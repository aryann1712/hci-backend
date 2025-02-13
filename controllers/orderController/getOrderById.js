// controllers/orderController/getOrderById.js
const Order = require("../../models/orderModel");

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params; // "ORD-xxxx"

    const order = await Order.findOne({ orderId }).populate("items.product");
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Ensure the user is admin or the owner
    if (req.user.role !== "admin" && req.user.userId !== order.user.toString()) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = getOrderById;
