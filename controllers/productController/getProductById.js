// controllers/productController/getProductById.js
const Product = require("../../models/productModel");
const { getObjectURL } = require("../../utils/s3Bucket");

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    const objectURL = await getObjectURL(product.image);
    product.image = objectURL;
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = getProductById;
