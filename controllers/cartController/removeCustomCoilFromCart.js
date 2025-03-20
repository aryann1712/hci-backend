// controllers/cartController/removeFromCart.js
const Cart = require("../../models/cartModel");

const removeCustomCoilFromCart = async (req, res, next) => {
    try {
        // const userId = req.user.userId;
        const userId = req.body.userId;

        const {
            coilType,
            height,
            length,
            rows,
            fpi,
            endplateType,
            circuitType,
            numberOfCircuits,
            headerSize,
            tubeType,
            finType,
            distributorHoles,
            distributorHolesDontKnow,
            inletConnection,
            inletConnectionDontKnow,
        } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found." });
        }

        // Filter out the matching custom item based on all fields
        cart.customItems = cart.customItems.filter(item => {
            return !(
                item.coilType === coilType &&
                item.height === height &&
                item.length === length &&
                item.rows === rows &&
                item.fpi === fpi &&
                item.endplateType === endplateType &&
                item.circuitType === circuitType &&
                item.numberOfCircuits === numberOfCircuits &&
                item.headerSize === headerSize &&
                item.tubeType === tubeType &&
                item.finType === finType &&
                item.distributorHoles === distributorHoles &&
                item.distributorHolesDontKnow === distributorHolesDontKnow &&
                item.inletConnection === inletConnection &&
                item.inletConnectionDontKnow === inletConnectionDontKnow
            );
        });

        await cart.save();

        cart = await Cart.findById(cart._id).populate("items.product");
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

module.exports = removeCustomCoilFromCart;
