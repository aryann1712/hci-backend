// controllers/userController/signUpUser.js
const sendEmail = require("../../utils/nodeMailer")

const sendRequestToAdmin = async (req, res, next) => {
    try {
        const { name, phone, description } = req.body;


        // Send email with credentials
        try {
            const mailOptions = {
                from: process.env.SENDER_MAIL,
                to: process.env.SENDER_MAIL,
                subject: "Contact Form Submitted",
                text: `
            Hi,

            Name: ${name}
            Phone: ${phone}
            Description: ${description}


            Regards,
            ${process.env.COMPANY_NAME}
            `,
            };
            await sendEmail(mailOptions);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Failed to send email" });
        }

        // Possibly send email with credentials
        res.status(201).json({
            success: true,
            message: "Submitted Successfully.",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = sendRequestToAdmin;
