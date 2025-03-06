const Order = require("../../models/orderModel");
const sendEmail = require("../../utils/nodeMailer")

const createOrder = async (req, res, next) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    const { nanoid } = await import('nanoid'); // Dynamic Import
    // const userId = req.user.userId;
    const userId = req.body.user;
    const { items, status } = req.body;

    const orderId = `ORD-${nanoid()}`;

    const newOrder = await Order.create([{
      user: userId,
      orderId,
      status: status || "Enquiry",
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity || 1,
        price: i.price || 0,
      })),
    }], { session });

    if (!newOrder) {
      return res.status(500).json({ error: "Failed to create Order" });
    }

    // // Send email with credentials
    // try {
    //   const mailOptions = {
    //     from: "hci@gmail.com",
    //     to: email,
    //     subject: "User Registration Details",
    //     text: `
    //         Hi ${companyName},

    //         Thank you for registering with us. Here are your credentials to login:

    //         Your password: ${password}

    //         Regards,
    //         ${process.env.COMPANY_NAME}
    //         `,
    //   };
    //   await sendEmail(mailOptions);
    // } catch (error) {
    //   console.log(error);
    //   return res.status(500).json({ error: "Failed to send email" });
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

module.exports = createOrder;
