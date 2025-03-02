// controllers/userController/updateUserProfile.js
const User = require("../../models/userModel");
const UserRole = require("../../enums/role")

const updateEmployeeRole = async (req, res, next) => {
  try {
    const loggedInUserId = req.user.userId;
    const userIdToUpdate = req.params.id;
    const { role } = req.body;

    // Check if the logged-in user has admin role
    const loggedInUser = await User.findById(loggedInUserId);
    if (loggedInUser.role !== UserRole.ADMIN) {
      return res.status(403).json({ error: "Unauthorized to update user role." });
    }

    // Validate the role
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).json({ error: "Invalid role." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userIdToUpdate,
      { role },
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

module.exports = updateEmployeeRole;
