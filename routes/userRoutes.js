// routes/userRoutes.js
const express = require("express");
const signUpUser = require("../controller/userController/signUpUser");
const signInUser = require("../controller/userController/signInUser");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/signin", signInUser);


module.exports = router;
