const { Order } = require("../../models");

const removeFromCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Order.findOne({ where: { userId, status: "Cart" } });
    if (!cart) {
      return res.status(404).json({ error: "Cart not found." });
    }

    let items = cart.items || [];
    items = items.filter((item) => item.productId !== parseInt(productId, 10));
    cart.items = items;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = removeFromCart;
