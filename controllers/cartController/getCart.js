// controllers/cartController/getCart.js
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const { getObjectURL } = require("../../utils/s3Bucket");


const getCart = async (req, res, next) => {
  try {
    // const userId = req.user.userId;
    const userId = req.params.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ success: true, data: { items: [] } });
    }

    const updatedProducts = cart.items.map(async (item) => {
      if (item.product.images) {
        const imagePromises = item.product.images.map(getObjectURL);
        item.product.images = await Promise.all(imagePromises);
      }
      return item.product.product;
    });

    const resolvedProducts = await Promise.all(updatedProducts);

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

module.exports = getCart;
