// controllers/productController/createProduct.js
const Product = require("../../models/productModel");
const { putObject } = require("../../utils/s3Bucket"); // Import the function to upload to S3

const createProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { name, category, description, price, sku } = req.body;
    const imageData = req.file;
    const contentType = imageData.mimetype;
    const fileExtention = contentType.split('/')[1];

    // Check if SKU is unique
    if (sku) {
      const existing = await Product.findOne({ sku });
      if (existing) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "SKU already exists." });
      }
    }
    // If an image is provided, upload it to S3
    if (imageData) {
      const fileName = `product-${Date.now()}.${fileExtention}`;
      try {
        const imagePath = await putObject(fileName, contentType, req.file.buffer);
        image = imagePath;
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error uploading image to S3:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    const product = await Product.create(
      [
        {
          name,
          category,
          description,
          image,
          price,
          sku,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = createProduct;
