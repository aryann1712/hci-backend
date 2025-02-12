const shortid = require("shortid");
const { Order } = require("../../models");

const createOrder = async (req, res, next) => {
  try {
    // userId from authMiddleware (decoded from JWT)
    const userId = req.user.userId;
    const { items, status } = req.body;

    const orderId = `ORD-${shortid.generate()}`;

    const newOrder = await Order.create({
      userId,          // from decoded token
      orderId,
      items,           // e.g. an array of {product, quantity}
      status: status || "Enquiry",
    });

    // Possibly send email to user/admin here
    // ...

    res.status(201).json({ success: true, data: newOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = createOrder;
