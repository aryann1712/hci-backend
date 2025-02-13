// controllers/productController/deleteProduct.js
const Product = require("../../models/productModel");

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId);
    if (!deleted) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteProduct;
