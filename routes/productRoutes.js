const express = require("express");
const createProduct = require("../controllers/productController/createProduct");
const getAllProducts = require("../controllers/productController/getAllProduct");
const getProductById = require("../controllers/productController/getProductById");
const updateProduct = require("../controllers/productController/updateProduct");
const deleteProduct = require("../controllers/productController/deleteProduct");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { createProductSchema, updateProductSchema } = require("../validators/productValidators");
const { zodValidate } = require("../middleware/zodValidate");

const router = express.Router();

// public
router.get("/", getAllProducts);
router.get("/:productId", getProductById);

// admin only
router.post("/", protect, adminOnly, zodValidate(createProductSchema), createProduct);
router.put("/:productId", protect, adminOnly,zodValidate(updateProductSchema), updateProduct);
router.delete("/:productId", protect, adminOnly, deleteProduct);

module.exports = router;
