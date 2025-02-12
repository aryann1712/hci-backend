const bcrypt = require("bcrypt");
const { User } = require("../../models/userModel"); // from models/index.js if you prefer

const signUpUser = async (req, res, next) => {
  try {
    const { phone, password, gstNumber, companyName, address } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ where: { phone } });
    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      phone,
      passwordHash,
      gstNumber,
      companyName,
      address,
    });

    // Optionally email user with credentials
    // ...

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      userId: newUser.id,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signUpUser;
