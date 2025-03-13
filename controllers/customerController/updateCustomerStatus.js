// controllers/userController/updateUserProfile.js
const User = require("../../models/userModel");
const UserRole = require("../../enums/role")

const updateCustomerStatus = async (req, res, next) => {
  try {
  
    const { status, adminId, updateId } = req.body;

    // Check if the logged-in user has admin role
    const loggedInUser = await User.findById(adminId);
    if (loggedInUser.role !== "admin") {
      return res.status(403).json({ error: "Unauthorized to update user role." });
    }

    // Validate the role
    // if (status == "admin") {
    //   return res.status(400).json({ error: "Invalid role." });
    // }


    const updatedUser = await User.findByIdAndUpdate(
      updateId,
      { status },
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

module.exports = updateCustomerStatus;
