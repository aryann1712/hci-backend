// controllers/userController/signUpUser.js
const bcrypt = require("bcrypt");
const User = require("../../models/userModel");
const sendEmail = require("../../utils/nodeMailer")
const generatePassword = require("../../utils/passGen");

const signUpUser = async (req, res, next) => {
  const session = await User.startSession();
  session.startTransaction();
  try {
    const { phone, email, gstNumber, companyName, address } = req.body;

    // Check if user exists
    const existing = await User.findOne({ phone });
    if (existing) {
      return res.status(400).json({ error: "User already exists." });
    }

    const password = generatePassword();
    // const password = "password";
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create([{
      phone,
      email,
      passwordHash,
      gstNumber,
      companyName,
      address,
    }], { session });

    // Send email with credentials
    try {
      const mailOptions = {
        from: "hci@gmail.com",
        to: email,
        subject: "User Registration Details",
        text: `
            Hi ${companyName},

            Thank you for registering with us. Here are your credentials to login:

            Your password: ${password}

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

    // Possibly send email with credentials
    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      userId: newUser._id,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = signUpUser;
