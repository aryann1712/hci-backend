// controllers/productController/updateProduct.js
const Product = require("../../models/productModel");

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, category, description, image, price } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { name, category, description, image, price },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

module.exports = updateProduct;
