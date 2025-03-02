const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

const changePassword = async (req, res, next) => {
    try {
        // const userId = req.user.userId;
        // const { phone, oldPassword, newPassword } = req.body;
        const { userId, phone, currentPassword, newPassword } = req.body;

        // Check if user exists
        const user = await User.findOne({ _id: userId, phone });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Verify the old password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid old password." });
        }

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.passwordHash = passwordHash;
        await user.save();

        res.status(200).json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        next(error);
    }
};

module.exports = changePassword;