// controllers/productController/getAllProducts.js
const Product = require("../../models/productModel");

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
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllProducts;
