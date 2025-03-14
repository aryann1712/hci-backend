const Product = require("../../models/productModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

/**
 * Get products by a single category
 * @route GET /api/products/category/:categoryName
 * @param {string} categoryName - The category to filter by
 * @returns {Object} 200 - Products filtered by the specified category
 */
const getProductsByCategory = async (req, res, next) => {
    try {
        const { categoryName } = req.params;

        if (!categoryName) {
            return res.status(400).json({
                success: false,
                error: "Category name is required"
            });
        }

        // Find products that have the specified category in their categories array
        const products = await Product.find({
            categories: categoryName
        }).sort({ createdAt: -1 });

        const updatedProducts = [];

        // Process images for each product
        for (let product of products) {
            if (product.images && product.images.length > 0) {
                const imagePromises = product.images.map(async (image) => {
                    const objectURL = await getObjectPublicURL(image);
                    return objectURL;
                });
                const resolvedImagePromises = await Promise.all(imagePromises);
                product.images = resolvedImagePromises;
            }
            updatedProducts.push(product);
        }

        res.status(200).json({
            success: true,
            count: updatedProducts.length,
            data: updatedProducts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getProductsByCategory; 