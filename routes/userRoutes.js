const express = require("express");
const signUpUser = require("../controllers/userController/signUpUser");
const signInUser = require("../controllers/userController/signInUser");
const getUserProfile = require("../controllers/userController/getUserProfile");
const updateUserProfile = require("../controllers/userController/updateUserProfile");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;
