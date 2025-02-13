// controllers/userController/getUserProfile.js
const User = require("../../models/userModel");

const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = getUserProfile;
