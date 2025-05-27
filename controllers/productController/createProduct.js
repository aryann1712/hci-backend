// controllers/productController/createProduct.js
const Product = require("../../models/productModel");
const { putObject } = require("../../utils/s3Bucket"); // Import the function to upload to S3

const createProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  try {
    const { name, categories, description, price, sku } = req.body;
    const imagesData = req.files;
    console.log("Request body:", req.body); // Debug log
    console.log("Raw dimensions from request:", {
      length: req.body['dimensions[length]'],
      width: req.body['dimensions[width]'],
      height: req.body['dimensions[height]']
    }); // Debug log for raw dimensions
    const images = [];

    // Parse dimensions from form data with proper type conversion
    const dimensions = {
      length: parseFloat(req.body['dimensions[length]']) || 0,
      width: parseFloat(req.body['dimensions[width]']) || 0,
      height: parseFloat(req.body['dimensions[height]']) || 0
    };
    
    console.log("Parsed dimensions:", dimensions); // Debug log
    console.log("Dimensions type check:", {
      length: typeof dimensions.length,
      width: typeof dimensions.width,
      height: typeof dimensions.height
    }); // Debug log for type checking

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

      const fileName = `product-images/product-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtention}`;
      try {
        const imagePath = await putObject(fileName, contentType, imageData.buffer);
        // Store only the relative path without the base S3 URL
        const path = imagePath.includes('s3.ap-south-1.amazonaws.com/') 
          ? imagePath.split('s3.ap-south-1.amazonaws.com/').pop() 
          : imagePath;
        images.push(path);
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error uploading image to S3:", error);
        return res.status(500).json({ error: "Failed to upload image" });
      }
    }

    // Create product with dimensions
    const productData = {
      name,
      categories: categoriesArray,
      description,
      images,
      price,
      sku,
      dimensions: {
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height
      },
      sqmm: 0 // Default value for now
    };

    console.log("Creating product with data:", productData); // Debug log
    console.log("Final dimensions object:", productData.dimensions); // Debug log for final dimensions

    const product = await Product.create([productData], { session });
    console.log("Created product:", product[0]); // Debug log for created product

    await session.commitTransaction();
    session.endSession();
    res.status(201).json({ success: true, data: product[0] });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Create product error:", error); // Debug log
    next(error);
  }
};

module.exports = createProduct;
