// controllers/productController/createProduct.js
const Product = require("../../models/productModel");
const { putObject } = require("../../utils/s3Bucket"); // Import the function to upload to S3

const createProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { name, categories, description, price, sku } = req.body;
    const imagesData = req.files;
    console.log(imagesData)
    const images = [];

    // Check if categories is an array, if not, convert single value to array
    const categoriesArray = Array.isArray(categories) ? categories : categories ? [categories] : [];

    // Validate categories
    if (categoriesArray.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "At least one category is required." });
    }

    // Check if SKU is unique
    if (sku) {
      const existing = await Product.findOne({ sku });
      if (existing) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "SKU already exists." });
      }
    }

    // Iterate over each image and upload it to S3
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

    const product = await Product.create(
      [
        {
          name,
          categories: categoriesArray,
          description,
          images,
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
