// nodemailer.js
const nodemailer = require("nodemailer");

// const sendEmail = async (email, companyName, password, mailOptions) => {
const sendEmail = async (mailOptions) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            secure: true,
            port: 465,
            auth: {
                user: process.env.SENDER_MAIL,
                pass: process.env.SENDER_MAIL_PASSWORD,
            },
        });

        // const mailOptions = {
        //     from: "hci@gmail.com",
        //     to: email,
        //     subject: "User Registration Details",
        //     text: `
        //     Hi ${companyName},

        //     Thank you for registering with us. Here are your credentials to login:

        //     Your password: ${password}

        //     Regards,
        //     ${process.env.COMPANY_NAME}
        //     `,
        // };


        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
        // return info;
        return { success: true, message: "Email sent successfully." };
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendEmail;