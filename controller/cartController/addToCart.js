const { Order, Product } = require("../../models");

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    // Find or create a "cart" order for this user
    let cart = await Order.findOne({ where: { userId, status: "Cart" } });
    if (!cart) {
      cart = await Order.create({ userId, status: "Cart", items: [] });
    }

    // Get product details
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // Add item to cart items array
    let items = cart.items || [];
    const existingItemIndex = items.findIndex((item) => item.productId === productId);

    if (existingItemIndex >= 0) {
      // update quantity
      items[existingItemIndex].quantity += quantity;
    } else {
      items.push({
        productId,
        quantity,
        name: product.name,
        price: product.price
      });
    }

    // update cart
    cart.items = items;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = addToCart;
