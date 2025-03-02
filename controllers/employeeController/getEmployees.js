const User = require("../../models/userModel");

const getEmployees = async (req, res, next) => {
    // const UserId = req.user.userId;
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (user) {
            if (user.role === "admin") {
                // const employees = await User.find({ gstNumber: user.gstNumber });
                const employees = await User.find({
                    $and: [
                        { gstNumber: user.gstNumber },
                        { _id: { $ne: userId } },
                    ],
                });
                res.status(200).json({
                    success: true,
                    employees,
                });
            } else {
                return res.status(403).json({ error: "Unauthorized to view employees." });
            }
        } else {
            return res.status(404).json({ error: "User not found." });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = getEmployees;