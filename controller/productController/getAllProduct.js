const { Product } = require("../../models");

const getAllProducts = async (req, res, next) => {
  try {
    // For category filters: e.g. /api/products?category=xyz
    const { category, search } = req.query;
    let whereClause = {};

    if (category) {
      whereClause.category = category;
    }
    if (search) {
      // basic search example
      whereClause.name = { $like: `%${search}%` };
    }

    const products = await Product.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]]
    });

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllProducts;
