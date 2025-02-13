// controllers/cartController/removeFromCart.js
const Cart = require("../../models/cartModel");

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    cart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = removeFromCart;
