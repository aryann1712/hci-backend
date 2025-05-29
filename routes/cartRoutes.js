const express = require("express");
const addToCart = require("../controllers/cartController/addToCart");
const getCart = require("../controllers/cartController/getCart");
const removeFromCart = require("../controllers/cartController/removeFromCart");
const reduceProductQuantity = require("../controllers/cartController/reduceProductQuantity");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { addToCartSchema, removeFromCartSchema } = require("../validators/cartValidators");
const addCustomCoilToCart = require("../controllers/cartController/addCustomCoilToCart");
const removeCustomCoilFromCart = require("../controllers/cartController/removeCustomCoilFromCart");
const saveCart = require("../controllers/cartController/saveCart");

const router = express.Router();

// Cart routes with authentication
router.post("/add", protect, zodValidate(addToCartSchema), addToCart);
router.post("/addCustomCoil", protect, addCustomCoilToCart);
router.get("/:id", protect, getCart);  // This route expects the user ID as a parameter
router.delete("/:productId", protect, zodValidate(removeFromCartSchema), removeFromCart);
router.post("/deleteCustomCoil", protect, removeCustomCoilFromCart);
router.put("/reduce/:productId", protect, zodValidate(removeFromCartSchema), reduceProductQuantity);
router.post("/save", saveCart);

module.exports = router;
