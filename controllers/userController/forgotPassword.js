const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/nodeMailer")
const generatePassword = require("../../utils/passGen");

const forgotPassword = async (req, res, next) => {
    const session = await User.startSession();
    session.startTransaction();
    try {
        // const userId = req.user.userId;
        // const { phone, oldPassword, newPassword } = req.body;
        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        const newPassword = generatePassword();

        // Hash the new password
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update the password
        user.passwordHash = passwordHash;
        await user.save({ session });

        // Send email with credentials
        try {
            const mailOptions = {
                from: "hci@gmail.com",
                to: email,
                subject: "User forgotten password",
                text: `
            Hi ${user.companyName},

            Thank you for registering with us. 
            Here are your credentials to login:

            Your New Password: ${newPassword}

            Regards,
            ${process.env.COMPANY_NAME}
            `,
            };
            // await sendEmail(email, companyName, password);
            await sendEmail(mailOptions);
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
            session.endSession();
            return res.status(500).json({ error: "Failed to send email" });
        }

        await session.commitTransaction();
        session.endSession();
        res.status(200).json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

module.exports = forgotPassword;