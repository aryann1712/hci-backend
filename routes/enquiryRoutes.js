const express = require("express");
const createEnquiry = require("../controllers/enquiryController/createEnquiry");
const getAllEnquiry = require("../controllers/enquiryController/getAllEnquiry");
const getEnquiryByUserId = require("../controllers/enquiryController/getEnquiryByUserId");
const getAllEnquiryBetweenDates = require("../controllers/enquiryController/getAllEnquiryBetweenDates");
const { protect } = require("../middleware/authMiddleware");
const { zodValidate } = require("../middleware/zodValidate");
const { signUpSchema, signInSchema, updateUserProfileSchema, changePasswordSchema } = require("../validators/userValidators");

const router = express.Router();

router.post("/", createEnquiry);
router.get("/", getAllEnquiry);
router.get("/between", getAllEnquiryBetweenDates);
router.get("/:id", getEnquiryByUserId);
// router.post("/signin", zodValidate(signInSchema), signInUser);
// // router.post("/signup", signUpUser);
// // router.post("/signin", signInUser);

// // router.get("/profile", protect, getUserProfile);
// // router.put("/profile", protect, zodValidate(updateUserProfileSchema), updateUserProfile);
// router.get("/profile/:id", getUserProfile);
// router.put("/profile/:id", updateUserProfile);

// // router.put("/cp", protect, zodValidate(changePasswordSchema), changePassword);
// router.put("/cp", zodValidate(changePasswordSchema), changePassword);
// // router.put("/cp", changePassword);

module.exports = router;
