const express = require("express");
const signInUser = require("../controllers/userController/signInUser");
const signUpUser = require("../controllers/userController/signUpUser");
const getUserProfile = require("../controllers/userController/getUserProfile");
const updateUserProfile = require("../controllers/userController/updateUserProfile");
const changePassword = require("../controllers/userController/changePassword");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { signUpSchema, signInSchema, updateUserProfileSchema, changePasswordSchema } = require("../validators/userValidators");

const router = express.Router();

// router.post("/signup", zodValidate(signUpSchema), signUpUser);
// router.post("/signin", zodValidate(signInSchema), signInUser);
router.post("/signup", signUpUser);
router.post("/signin", signInUser);

// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, zodValidate(updateUserProfileSchema), updateUserProfile);
router.get("/profile/:id", getUserProfile);
router.put("/profile/:id", updateUserProfile);

// router.put("/cp", protect, zodValidate(changePasswordSchema), changePassword);
router.put("/cp", zodValidate(changePasswordSchema), changePassword);
// router.put("/cp", changePassword);

module.exports = router;
