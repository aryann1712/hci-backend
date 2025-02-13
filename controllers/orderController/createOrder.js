const Order = require("../../models/orderModel");

const createOrder = async (req, res, next) => {
  try {
    const { nanoid } = await import('nanoid'); // Dynamic Import
    const userId = req.user.userId;
    const { items, status } = req.body; 

    const orderId = `ORD-${nanoid()}`;

    const newOrder = await Order.create({
      user: userId,
      orderId,
      status: status || "Enquiry",
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity || 1,
        price: i.price || 0,
      })),
    });

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = createOrder;
