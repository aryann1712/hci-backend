// controllers/orderController/updateOrderStatus.js
const Order = require("../../models/orderModel");

const updateOrderStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    ).populate("items.product");

    if (updatedOrder.length < 1) {
      return res.status(404).json({ error: "Order updation failed." });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = updateOrderStatus;
