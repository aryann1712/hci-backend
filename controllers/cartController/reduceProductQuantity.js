const Cart = require("../../models/cartModel");

const reduceProductQuantity = async (req, res, next) => {
    try {

        // const userId = req.user.userId;
        const userId = req.body.userId;

        const { productId } = req.params;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        // Find the item in the cart
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Product not found in cart." });
        }

        // Reduce the quantity
        const item = cart.items[itemIndex];
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            // cart.items.splice(itemIndex, 1); // Remove the item from the cart
            return res.status(404).json({ error: "Product can not be less than 1 Unit." });
        }

        await cart.save();

        // Populate for returning data
        const populatedCart = await Cart.findById(cart._id).populate("items.product");
        res.status(200).json({ success: true, data: populatedCart });
    } catch (error) {
        next(error);
    }
};

module.exports = reduceProductQuantity;