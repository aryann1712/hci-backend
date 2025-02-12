const { Product } = require("../../models");

const deleteProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const rowsDeleted = await Product.destroy({ where: { id: productId } });
    if (!rowsDeleted) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = deleteProduct;
