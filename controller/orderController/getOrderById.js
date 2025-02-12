const { Order } = require("../../models");

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    // If only admin or the user who created it can view:
    // check role or userId from token
    const order = await Order.findOne({ where: { orderId } });
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Optional: only allow user or admin
    if (req.user.role !== "admin" && req.user.userId !== order.userId) {
      return res.status(403).json({ error: "Access denied." });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = getOrderById;
