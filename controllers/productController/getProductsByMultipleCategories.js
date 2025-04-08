const Product = require("../../models/productModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

/**
 * Get products by multiple categories with match all/any options
 * @route GET /api/products/categories
 * @query {string} categories - Comma-separated list of categories
 * @query {boolean} matchAll - If true, match all categories (AND); if false/missing, match any (OR)
 * @returns {Object} 200 - Products filtered by the specified categories
 */
const getProductsByMultipleCategories = async (req, res, next) => {
    try {
        const { categories, matchAll } = req.query;

        if (!categories) {
            return res.status(400).json({
                success: false,
                error: "Categories parameter is required (comma-separated list)"
            });
        }

        // Split the comma-separated categories
        const categoryList = categories.split(',').map(cat => cat.trim()).filter(cat => cat.length > 0);

        if (categoryList.length === 0) {
            return res.status(400).json({
                success: false,
                error: "At least one valid category is required"
            });
        }

        // Build the query based on match type
        let query = {}; // Default query to show only products that are visible

        if (matchAll === 'true') {
            // Match ALL categories (products that have all the specified categories)
            query = { categories: { $all: categoryList } , show: true};
        } else {
            // Match ANY categories (products that have any of the specified categories)
            query = { categories: { $in: categoryList }, show: true };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
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
            matchType: matchAll === 'true' ? 'all' : 'any',
            categories: categoryList,
            data: updatedProducts
        });
    } catch (error) {
        next(error);
    }
};

module.exports = getProductsByMultipleCategories; 