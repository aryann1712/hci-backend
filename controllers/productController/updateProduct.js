// controllers/productController/updateProduct.js
const Product = require("../../models/productModel");
const { deleteObject, putObject } = require("../../utils/s3Bucket");

const updateProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { productId } = req.params;
    const { name, categories, description, price } = req.body;
    const imagesData = req.files;
    const images = []

    // Check if categories is an array, if not, convert single value to array when provided
    let categoriesArray;
    if (categories) {
      categoriesArray = Array.isArray(categories) ? categories : [categories];

      // Validate categories if provided
      if (categoriesArray.length === 0) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "If categories are provided, at least one category is required." });
      }
    }

    const product = await Product.findById(productId);

    if (product) {

      // Delete old images from S3
      if (product.images && product.images.length > 0) {
        for (const oldImage of product.images) {
          console.log("Removing old image:", oldImage)
          await deleteObject(oldImage);
        }
      }

      // Upload new images to S3
      for (const imageData of imagesData) {
        const contentType = imageData.mimetype;
        const fileExtention = contentType.split('/')[1];

        const fileName = `product-${Date.now()}.${fileExtention}`;
        try {
          const imagePath = await putObject(fileName, contentType, imageData.buffer);
          images.push(imagePath);
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
          console.error("Error uploading image to S3:", error);
          return res.status(500).json({ error: "Failed to upload image" });
        }
      }

      // Prepare update object with only provided fields
      const updateFields = {};
      if (name) updateFields.name = name;
      if (categoriesArray) updateFields.categories = categoriesArray;
      if (description) updateFields.description = description;
      if (images.length > 0) updateFields.images = images;
      if (price) updateFields.price = price;

      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updateFields,
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
