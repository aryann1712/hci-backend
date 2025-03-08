// controllers/orderController/getAllOrders.js
const Order = require("../../models/orderModel");
const { getObjectURL } = require("../../utils/s3Bucket");

const getAllOrders = async (req, res, next) => {
  try {
    // // confirm admin
    if (req.user.role == "admin" || req.user.role == "manager") {
    } else {
      return res.status(403).json({ error: "Admin or Manager only" });
    }

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-passwordHash"
      })  // populate user
      .populate("items.product");       // populate product

    if (orders.length < 1) {
      return res.status(200).json({ success: true, data: [] });
    }


    // Update each product's image URL with S3 URL
    const updatedOrders = await Promise.all(orders.map(async order => {
      const updatedItems = await Promise.all(order.items.map(async item => {
        if (item.product.images && item.product.images.length > 0) {
          item.product.images = await Promise.all(item.product.images.map(async image => {
            return await getObjectURL(image);
          }));
        }
        return item;
      }));

      return { ...order.toObject(), items: updatedItems };
    }));

    // res.status(200).json({ success: true, data: updatedOrders });
    res.status(200).json({ success: true, data: [updatedOrders] });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllOrders;
