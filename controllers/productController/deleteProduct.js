// controllers/productController/deleteProduct.js
const Product = require("../../models/productModel");
const { deleteObject } = require("../../utils/s3Bucket");

// const deleteProduct = async (req, res, next) => {
//   try {
//     const { productId } = req.params;
//     const deleted = await Product.findByIdAndDelete(productId);
//     if (!deleted) {
//       return res.status(404).json({ error: "Product not found." });
//     }
//     console.log(deleted)

//     res.status(200).json({ success: true, message: "Product deleted." });
//   } catch (error) {
//     next(error);
//   }
// };

const deleteProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();

  try {
    const { productId } = req.params;
    const deleted = await Product.findByIdAndDelete(productId, { session });
    if (!deleted) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Product not found." });
    } 

    console.log(deleted);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ success: true, message: "Product deleted." });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = deleteProduct;
