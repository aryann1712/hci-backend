// controllers/productController/getProductById.js
const Product = require("../../models/productModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

const getProductById = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (product.images && product.images.length > 0) {
      const imagePromises = product.images.map(async (image) => {
        const objectURL = await getObjectPublicURL(image);
        return objectURL;
      });
      const resolvedImagePromises = await Promise.all(imagePromises);
      product.images = resolvedImagePromises;
    } else {
      const objectURL = await getObjectPublicURL(product.image);
      product.images = objectURL;
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = getProductById;
