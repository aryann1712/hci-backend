const express = require("express");
const createProduct = require("../controllers/productController/createProduct");
const getAllProducts = require("../controllers/productController/getAllProducts");
const getProductById = require("../controllers/productController/getProductById");
const updateProduct = require("../controllers/productController/updateProduct");
const deleteProduct = require("../controllers/productController/deleteProduct");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getAllProducts); 
router.get("/:productId", getProductById);

// Admin-only for create/update/delete
router.post("/", protect, adminOnly, createProduct);
router.put("/:productId", protect, adminOnly, updateProduct);
router.delete("/:productId", protect, adminOnly, deleteProduct);

module.exports = router;
