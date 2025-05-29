// controllers/cartController/getCart.js
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

const getCart = async (req, res, next) => {
  try {
    // Get user ID from the authenticated user
    const userId = req.user.userId;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        error: "User not authenticated" 
      });
    }

    console.log("Fetching cart for user:", userId); // Debug log

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      console.log("No cart found for user:", userId); // Debug log
      return res.status(200).json({ 
        success: true, 
        data: { 
          items: [], 
          customItems: [] 
        } 
      });
    }

    console.log("Found cart:", cart); // Debug log

    // Process product images
    const updatedProducts = cart.items.map(async (item) => {
      if (item.product && item.product.images) {
        const imagePromises = item.product.images.map(getObjectPublicURL);
        item.product.images = await Promise.all(imagePromises);
      }
      return item.product;
    });

    const resolvedProducts = await Promise.all(updatedProducts);

    // Format the response data
    const resProductData = cart.items.map((item, index) => {
      if (!item.product) return null;
      
      return {
        _id: item.product._id,
        sku: item.product.sku,
        images: item.product.images || [],
        name: item.product.name,
        category: item.product.category,
        description: item.product.description,
        quantity: cart.items[index].quantity,
      };
    }).filter(Boolean); // Remove any null items

    console.log("Sending response with items:", resProductData.length); // Debug log

    // Send the response
    res.status(200).json({ 
      success: true, 
      data: {
        items: resProductData,
        customItems: cart.customItems || []
      } 
    });
  } catch (error) {
    console.error("Error in getCart:", error);
    next(error);
  }
};

module.exports = getCart;
