// controllers/productController/getAllProducts.js
const Product = require("../../models/productModel");
const { getObjectURL } = require("../../utils/s3Bucket");


/**
 * @swagger
 * /api/products:
 * Retrieves all products from the database, optionally filtered by category and search query.
 * If a category is provided, only products in that category are returned.
 * If a search query is provided, products whose names contain the query string (case-insensitive) are returned.
 * The products are sorted by creation date in descending order.
 * If a product has an associated image, its URL is fetched and updated in the product data.
 * Responds with a JSON object containing the list of products.
 *
 * @param {Object} req - Express request object containing the query parameters.
 * @param {Object} res - Express response object used to send back the desired HTTP response.
 * @param {Function} next - Express next middleware function for error handling.
 */
const getAllProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = {};

    if (category) {
      query.category = category;
    }
    if (search) {
      // simple "contains" match on name
      query.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    const updatedProducts = [];

    // // Promise.all is used to run all promises concurrently and wait for all of them to be resolved.
    // products.forEach(async (product) => {
    //   if (product.image) {
    //     const objectURL = await getObjectURL(product.image);
    //     product.image = objectURL;
    //   }
    //   updatedProducts.push(product);
    // });

    // await Promise.all(products.map(async (product) => {
    //   if (product.image) {
    //     const objectURL = await getObjectURL(product.image);
    //     product.image = objectURL;
    //   }
    // }));

    for (let product of products) {
      if (product.image) {
        const objectURL = await getObjectURL(product.image);
        product.image = objectURL;
      }
      updatedProducts.push(product);
    }

    res.status(200).json({ success: true, data: updatedProducts });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllProducts;
