// controllers/orderController/getAllOrders.js
const Order = require("../../models/orderModel");

const getAllOrders = async (req, res, next) => {
  try {
    // confirm admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Admin only" });
    }

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "phone email")  // populate user
      .populate("items.product");       // populate product

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllOrders;
