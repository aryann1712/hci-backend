const express = require("express");
const addToCart = require("../controllers/cartController/addToCart");
const getCart = require("../controllers/cartController/getCart");
const removeFromCart = require("../controllers/cartController/removeFromCart");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart actions require auth
router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;
