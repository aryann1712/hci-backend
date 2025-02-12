const { Order } = require("../../models");

const getCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const cart = await Order.findOne({ where: { userId, status: "Cart" } });
    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = getCart;
