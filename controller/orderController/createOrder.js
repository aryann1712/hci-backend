const shortid = require("shortid");
const { Order } = require("../../models");

const createOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    // If you want to "convert" a cart to an order, you might load that cart first.
    // Or the request might come with items in the body, e.g. for "Enquiry".
    const { items } = req.body;

    const orderId = `ORD-${shortid.generate()}`;
    const newOrder = await Order.create({
      userId,
      orderId,
      items,
      status: "Enquiry" // or "Ordered" if you prefer
    });

    // Send email notifications to user/admin (optional)
    // ...

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = createOrder;
