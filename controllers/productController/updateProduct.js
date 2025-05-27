// controllers/productController/updateProduct.js
const Product = require("../../models/productModel");
const { putObject } = require("../../utils/s3Bucket");

const updateProduct = async (req, res, next) => {
  const session = await Product.startSession();
  session.startTransaction();
  
  try {
    const { productId } = req.params;
    const { name, categories, description, price, sku, existingImages } = req.body;
    const imagesData = req.files;
    
    console.log("Request body:", req.body); // Debug log
    console.log("Raw dimensions from request:", {
      length: req.body['dimensions[length]'],
      width: req.body['dimensions[width]'],
      height: req.body['dimensions[height]']
    }); // Debug log for raw dimensions
    
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
    
    // Find the product to update
    const product = await Product.findById(productId);
    
    if (!product) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ error: "Product not found." });
    }
    
    // Check if categories is an array, if not, convert single value to array
    const categoriesArray = Array.isArray(categories) ? categories : categories ? [categories] : [];
    
    // Validate categories
    if (categoriesArray.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "At least one category is required." });
    }
    
    // Check if SKU is unique (if it was changed)
    if (sku && sku !== product.sku) {
      const existing = await Product.findOne({ sku });
      if (existing) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({ error: "SKU already exists." });
      }
    }
    
    // Parse existing images (if any were sent)
    let existingImagesArray = [];
    if (existingImages) {
      try {
        existingImagesArray = JSON.parse(existingImages);
      } catch (error) {
        existingImagesArray = existingImages ? [existingImages] : [];
      }
      
      // Normalize image paths - remove any S3 base URL if present
      existingImagesArray = existingImagesArray.map(img => {
        // If it's a full URL, extract just the path portion
        if (img.includes('s3.ap-south-1.amazonaws.com')) {
          const urlParts = img.split('s3.ap-south-1.amazonaws.com/');
          return urlParts[urlParts.length - 1];
        }
        return img;
      });
    }
    
    let images = [...existingImagesArray];
    
    // Process new uploaded images (if any)
    if (imagesData && imagesData.length > 0) {
      for (const imageData of imagesData) {
        const contentType = imageData.mimetype;
        const fileExtension = contentType.split('/')[1];
        // Add more randomness to filename to prevent collisions
        const fileName = `product-images/product-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        
        try {
          // Store only the relative path without the base S3 URL
          const imagePath = await putObject(fileName, contentType, imageData.buffer);
          
          // Make sure we're only storing the path, not the full URL
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
    }
    
    // Update the product with explicit dimensions object
    const updateData = {
      name,
      categories: categoriesArray,
      description,
      price,
      dimensions: {
        length: dimensions.length,
        width: dimensions.width,
        height: dimensions.height
      },
      sqmm: product.sqmm // Keep existing sqmm value
    };
    
    // Only update SKU if provided
    if (sku) updateData.sku = sku;
    
    // Only update images if there are any
    if (images.length > 0) updateData.images = images;
    
    console.log("Updating product with data:", updateData); // Debug log
    console.log("Final dimensions object:", updateData.dimensions); // Debug log for final dimensions
    
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, session }
    );
    
    console.log("Updated product:", updatedProduct); // Debug log for updated product
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({ success: true, data: updatedProduct });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Update product error:", error);
    next(error);
  }
};

module.exports = updateProduct;