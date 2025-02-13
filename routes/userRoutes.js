const express = require("express");
const signInUser = require("../controllers/userController/signInUser");
const signUpUser = require("../controllers/userController/signUpUser");
const getUserProfile = require("../controllers/userController/getUserProfile");
const updateUserProfile = require("../controllers/userController/updateUserProfile");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { signUpSchema, signInSchema, updateUserProfileSchema } = require("../validators/userValidators");

const router = express.Router();

router.post("/signup", zodValidate(signUpSchema), signUpUser);
router.post("/signin", zodValidate(signInSchema), signInUser);

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, zodValidate(updateUserProfileSchema), updateUserProfile);

module.exports = router;
