const { Order } = require("../../models");

const updateOrderStatus = async (req, res, next) => {
  try {
    // Admin route
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const [rowsUpdated, [updatedOrder]] = await Order.update(
      { status },
      {
        where: { orderId },
        returning: true
      }
    );

    if (!rowsUpdated) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = updateOrderStatus;
