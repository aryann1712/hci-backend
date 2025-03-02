const express = require("express");
const addToCart = require("../controllers/cartController/addToCart");
const getCart = require("../controllers/cartController/getCart");
const removeFromCart = require("../controllers/cartController/removeFromCart");
const reduceProductQuantity = require("../controllers/cartController/reduceProductQuantity");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { addToCartSchema, removeFromCartSchema } = require("../validators/cartValidators");

const router = express.Router();

// router.post("/add", protect, zodValidate(addToCartSchema), addToCart);
// router.get("/", protect, getCart);
// router.delete("/:productId", protect, zodValidate(removeFromCartSchema), removeFromCart);
// router.put("/reduce/:productId", protect, zodValidate(removeFromCartSchema), reduceProductQuantity);


router.post("/add", addToCart);
router.get("/:id", getCart);
router.delete("/:productId", removeFromCart);
router.put("/reduce/:productId", reduceProductQuantity);

module.exports = router;
