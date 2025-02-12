const { Product } = require("../../models");

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = getProductById;
