// controllers/orderController/getOrderById.js
const Order = require("../../models/orderModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params; // "ORD-xxxx"

    // // Ensure the user is admin or the owner
    // if (req.user.role !== "admin" && req.user.userId !== order.user.toString()) {
    //   return res.status(403).json({ error: "Access denied." });
    // }

    const order = await Order.findOne({ orderId }).populate("items.product")
      .sort({ createdAt: -1 })
      .populate("user", "phone email")  // populate user
      .populate("items.product");       // populate product;

    // Check if order exists
    if (!order) {
      return res.status(404).json({ error: "Order not found." });
    }

    // Update each product's image URL with S3 URL
    const updatedOrder = await Promise.all(order.items.map(async item => {
      if (item.product.images && item.product.images.length > 0) {
        item.product.images = await Promise.all(item.product.images.map(async image => {
          return await getObjectPublicURL(image);
        }));
      }
      return item;
    }));

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

module.exports = getOrderById;
