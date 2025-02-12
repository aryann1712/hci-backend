const { Product } = require("../../models");

const updateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { name, category, description, image, price } = req.body;

    const [rowsUpdated, [updatedProduct]] = await Product.update(
      { name, category, description, image, price },
      {
        where: { id: productId },
        returning: true
      }
    );

    if (!rowsUpdated) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    next(error);
  }
};

module.exports = updateProduct;
