const express = require("express");
const signUpUser = require("../controller/userController/signUpUser");
const signInUser = require("../controller/userController/signInUser");
const getUserProfile = require("../controller/userController/getUserProfile");
const updateUserProfile = require("../controller/userController/updateUserProfile");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/signup", signUpUser);
router.post("/signin", signInUser);

// Protected
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
