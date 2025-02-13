// controllers/userController/signUpUser.js
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

const signUpUser = async (req, res, next) => {
  try {
    const { phone, email, password, gstNumber, companyName, address } = req.body;

    // Check if user exists
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      phone,
      email,
      passwordHash,
      gstNumber,
      companyName,
      address,
    });

    // Possibly send email with credentials
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      userId: newUser._id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signUpUser;
