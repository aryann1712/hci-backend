// controllers/productController/updateProduct.js
const Product = require("../../models/productModel");

const updateProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { productId } = req.params;
    const { name, categories, description, price } = req.body;

    const product = await Product.findById(productId);

    if (product) {

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, categories, description, price },
        { new: true },
        { session }
      );

      await session.commitTransaction();
      session.endSession();
      res.status(200).json({ success: true, data: updatedProduct });
    } else {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "Product not found." });
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = updateProduct;
