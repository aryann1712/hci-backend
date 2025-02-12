const { Order } = require("../../models");

const getAllOrders = async (req, res, next) => {
  try {
    // Admin route
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admin only." });
    }

    const orders = await Order.findAll({ order: [["createdAt", "DESC"]] });
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllOrders;
