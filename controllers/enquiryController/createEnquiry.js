const Enquiry = require("../../models/enquiryModel");
const sendEmail = require("../../utils/nodeMailer");
const Cart = require("../../models/cartModel");



const createEnquiry = async (req, res, next) => {
    const session = await Enquiry.startSession();
    session.startTransaction();
    try {
        const { nanoid } = await import('nanoid'); // Dynamic Import
        const userId = req.body.user;
        const { items, status } = req.body;

        const enquiryId = `ENQ-${nanoid()}`;

        const newOrder = await Enquiry.create([{
            user: userId,
            enquiryId,
            status: status || "Requested",
            items: items.map((i) => ({
                product: i.product,
                quantity: i.quantity || 1,
                price: i.price || 0,
            })),
        }], { session });

        if (!newOrder) {
            return res.status(500).json({ error: "Failed to create Enquiry" });
        }


        //now delete the cart with 
        await Cart.deleteMany({ user: userId }, { session });


        // Send email with credentials
        // try {
        //     const userMail = {
        //         from: "hci@gmail.com",
        //         to: user.email,
        //         subject: "User Registration Details",
        //         text: `
        //     Hi company_name,

        //     Thank you for registering with us. Here are your credentials to login:

        //     Your password: 

        //     Regards,
        //     ${process.env.COMPANY_NAME}
        //     `,
        //     };

        //     const adminMail = {
        //         from: "hci@gmail.com",
        //         to: "admin@gmail.com",
        //         subject: "User Registration Details",
        //         text: `
        //     Hi company_name,

        //     Thank you for registering with us. Here are your credentials to login:

        //     Your password: 

        //     Regards,
        //     ${process.env.COMPANY_NAME}
        //     `,
        //     };
        //     await sendEmail(userMail);
        //     console.log("User mail sent successfully")
        //     await sendEmail(adminMail);
        //     console.log("Admin mail sent successfully")
        // } catch (error) {
        //     console.log(error);
        //     await session.abortTransaction();
        //     session.endSession();
        //     return res.status(500).json({ error: "Failed to send email" });
        // }

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({ success: true, data: newOrder });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

module.exports = createEnquiry;
