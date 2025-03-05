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
      return res.status(200).json({ success: true, data: [] });
    }

    const updatedProducts = cart.items.map(async (item) => {
      if (item.product.images) {
        const imagePromises = item.product.images.map(getObjectURL);
        item.product.images = await Promise.all(imagePromises);
      }
      return item.product.product;
    });

    const resolvedProducts = await Promise.all(updatedProducts);

    const resProductData = cart.items.map((item, index) => {
      return {
        _id: item.product._id,
        sku: item.product.sku,
        images: item.product.images,
        name: item.product.name,
        category: item.product.category,
        description: item.product.description,
        quantity: cart.items[index].quantity,
      };
    });

    res.status(200).json({ success: true, data: resProductData });
  } catch (error) {
    next(error);
  }
};

module.exports = getCart;
