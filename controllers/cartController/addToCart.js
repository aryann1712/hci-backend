// controllers/cartController/addToCart.js
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");

const addToCart = async (req, res, next) => {
  try {
    // const userId = req.user.userId;
    const userId = req.body.user;
    const { productId, quantity, price } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    // See if item is already in cart
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      if (quantity > 1 && quantity) {
        existingItem.quantity = quantity;
      } else {
        existingItem.quantity = quantity || 1;
      }
      existingItem.price = price ?? product.price ?? 0; // or keep old price
    } else {
      cart.items.push({
        product: product._id,
        quantity: quantity || 1,
        price: price ?? product.price ?? 0,
      });
    }

    await cart.save();

    // Populate for returning data
    const populatedCart = await Cart.findById(cart._id).populate("items.product");
    res.status(200).json({ success: true, data: populatedCart });
  } catch (error) {
    next(error);
  }
};

module.exports = addToCart;
