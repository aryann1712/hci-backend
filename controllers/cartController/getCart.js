// controllers/cartController/getCart.js
const Cart = require("../../models/cartModel");

const getCart = async (req, res, next) => {
  try {
    // const userId = req.user.userId;
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = getCart;
