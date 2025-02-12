const { Product } = require("../../models");

const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, image, price, sku } = req.body;

    // Check SKU duplication
    const existing = await Product.findOne({ where: { sku } });
    if (existing) {
      return res.status(400).json({ error: "SKU already exists." });
    }

    const product = await Product.create({
      name,
      category,
      description,
      image,
      price,
      sku
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = createProduct;
