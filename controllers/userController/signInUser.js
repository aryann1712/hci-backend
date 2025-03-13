// controllers/userController/signInUser.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");

const signInUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    if(!user.status) {
      return res.status(401).json({ error: "Status not Active. Contact Owner" });
    } 

    // Create JWT
    const token = jwt.sign(
      { userId: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
    );

    res.status(200).json({
      success: true,
      email,
      id: user._id,
      phone : user.phone,
      name: user.name,
      role: user.role,
      token,
      message: "Sign in successful.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = signInUser;
