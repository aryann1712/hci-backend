// controllers/productController/getAllProducts.js
const Product = require("../../models/productModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");


const getAllProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const query = { show: true };

    if (category) {
      // Find products that have the specified category in their categories array
      query.categories = category;
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

    res.status(200).json({ success: true, data: updatedProducts });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllProducts;
