// controllers/productController/updateProduct.js
const Product = require("../../models/productModel");
const { deleteObject, putObject } = require("../../utils/s3Bucket");

const updateProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { productId } = req.params;
    const { name, category, description, price } = req.body;
    const imageData = req.file;
    const contentType = imageData.mimetype;
    const fileExtention = contentType.split('/')[1];

    const product = await Product.findById(productId);

    if (product) {
      // If an image is provided, upload it to S3
      if (imageData) {
        const fileName = `product-${Date.now()}.${fileExtention}`;
        try {
          await deleteObject(product.image)
          const imagePath = await putObject(fileName, contentType, req.file.buffer);
          image = imagePath;
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error("Error uploading image to S3:", error);
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      // const product = await Product.findById(productId);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, category, description, image, price },
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
