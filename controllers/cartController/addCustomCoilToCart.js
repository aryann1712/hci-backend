const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel");

const addCustomCoilToCart = async (req, res, next) => {
    try {
        // const userId = req.user.userId;
        const userId = req.body.user;
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
            quantity
        } = req.body;

        let cart = await Cart.findOne({ user: userId });
        if (!cart) {
            cart = await Cart.create({ user: userId, items: [], customItems: [] });
        }

        // Check if the custom coil item already exists in the customItems array
        const existingCustomCoil = cart.customItems.find(item => 
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
            item.inletConnection === inletConnection
        );

        if (existingCustomCoil) {
            // If the custom coil already exists, just update the quantity
            if (quantity > 1 && quantity) {
                existingCustomCoil.quantity = quantity;
            } else {
                existingCustomCoil.quantity = quantity || 1;
            }
        } else {
            // If the custom coil does not exist, add the new item to customItems
            cart.customItems.push({
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
                quantity: quantity || 1
            });
        }

        // Save the cart with updated custom coil items
        await cart.save();

        // Populate the cart for returning the data
        // const populatedCart = await Cart.findById(cart._id).populate("customItems");
        res.status(200).json({ success: true});
    } catch (error) {
        next(error);
    }
};

module.exports = addCustomCoilToCart;
