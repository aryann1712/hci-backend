const Cart = require("../../models/cartModel");

const saveCart = async (req, res, next) => {
  try {
    const { userId, cartItems } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Find or create cart for user
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [], customItems: [] });
    }

    // Update cart items
    cart.items = cartItems.items.map(item => ({
      product: item._id,
      quantity: item.quantity,
      price: item.price || 0
    }));

    // Update custom items
    cart.customItems = cartItems.customCoils;

    // Save the cart
    await cart.save();

    // Return updated cart
    cart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = saveCart; 