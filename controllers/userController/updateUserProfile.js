// controllers/userController/updateUserProfile.js
const User = require("../../models/userModel");

const updateUserProfile = async (req, res, next) => {
  try {
    // const userId = req.user.userId;
    const userId = req.params.id;
    const { gstNumber, companyName, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gstNumber, companyName, address },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    next(error);
  }
};

module.exports = updateUserProfile;
