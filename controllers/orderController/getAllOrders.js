// controllers/orderController/getAllOrders.js
const Order = require("../../models/orderModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

const getAllOrders = async (req, res, next) => {
  try {
    // // confirm admin
    // if (req.user.role !== "admin") {
    //   return res.status(403).json({ error: "Admin only" });
    // }

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("user", "phone email")  // populate user
      .populate("items.product");       // populate product

    if (orders.length < 1) {
      return res.status(404).json({ error: "No orders found." });
    }


    // Update each product's image URL with S3 URL
    const updatedOrders = await Promise.all(orders.map(async order => {
      const updatedItems = await Promise.all(order.items.map(async item => {
        if (item.product.images && item.product.images.length > 0) {
          item.product.images = await Promise.all(item.product.images.map(async image => {
            return await getObjectPublicURL(image);
          }));
        }
        return item;
      }));

      return { ...order.toObject(), items: updatedItems };
    }));

    res.status(200).json({ success: true, data: updatedOrders });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllOrders;
