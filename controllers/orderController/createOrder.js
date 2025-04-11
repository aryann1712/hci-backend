const Order = require("../../models/orderModel");
const sendEmail = require("../../utils/nodeMailer");
const Cart = require("../../models/cartModel");
const Product = require("../../models/productModel"); // Add this to fetch product names


// Helper function to get financial year
const getFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JavaScript months are 0-indexed
  
  // Financial year format: YY-YY (e.g., 25-26)
  // If current month is January to March, it's previous year to current year
  // If current month is April to December, it's current year to next year
  if (month <= 3) { // January to March
    return `${(year-1).toString().slice(-2)}-${year.toString().slice(-2)}`;
  } else { // April to December
    return `${year.toString().slice(-2)}-${(year+1).toString().slice(-2)}`;
  }
};

// Helper function to generate order ID by finding the last order and incrementing
const generateOrderId = async () => {
  const financialYear = getFinancialYear();
  const orderPrefix = `HCI/${financialYear}/ORD-`;
  
  // Find the latest order with the current financial year prefix
  const latestOrder = await Order.findOne({
    orderId: { $regex: `^${orderPrefix}` }
  }).sort({ orderId: -1 });
  
  let sequenceNumber = 1; // Default starting number
  
  // If an order already exists for this financial year, extract and increment the number
  if (latestOrder) {
    const lastOrderId = latestOrder.orderId;
    const lastSequenceNumber = parseInt(lastOrderId.split('-').pop(), 10);
    sequenceNumber = lastSequenceNumber + 1;
  }
  
  // Format the sequence number with leading zeros
  const formattedNumber = sequenceNumber.toString().padStart(3, '0');
  
  // Return the formatted order ID
  return `${orderPrefix}${formattedNumber}`;
};


const createOrder = async (req, res, next) => {
  const session = await Order.startSession();
  session.startTransaction();
  try {
    // const userId = req.user.userId;
    const userId = req.body.user;
    const { items, customItems, status } = req.body;
    const orderId = await generateOrderId();

    const newOrder = await Order.create([{
      user: userId,
      orderId,
      status: status || "Enquiry",
      items: items.map((i) => ({
        product: i.product,
        quantity: i.quantity || 1,
        price: i.price || 0,
      })),
      customItems: customItems.map((i) => ({
        coilType: i.coilType || '',
        height: i.height || '',
        length: i.length || '',
        rows: i.rows || '',
        fpi: i.fpi || '',
        endplateType: i.endplateType || '',
        circuitType: i.circuitType || '',
        numberOfCircuits: i.numberOfCircuits || '',
        headerSize: i.headerSize || '',
        tubeType: i.tubeType || '',
        pipeType: i.pipeType || '',
        finType: i.finType || '',
        distributorHoles: i.distributorHoles || '',
        distributorHolesDontKnow: i.distributorHolesDontKnow || false,
        inletConnection: i.inletConnection || '',
        inletConnectionDontKnow: i.inletConnectionDontKnow || false,
        quantity: i.quantity || 1,
      }))
    }], { session });

    if (!newOrder) {
      return res.status(500).json({ error: "Failed to create Order" });
    }

    // Delete the cart
    await Cart.deleteMany({ user: userId }, { session });

    // Fetch product names for regular items
    const productIds = items.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } }, { name: 1, _id: 1 });

    // Create a map of product IDs to names for easy lookup
    const productMap = {};
    products.forEach(product => {
      productMap[product._id.toString()] = product.name;
    });

    // Prepare email content with product details
    let emailContent = `
Hi,

New order (${orderId}) has been placed.

`;

    // Add regular items to the email
    if (items && items.length > 0) {
      emailContent += `
Regular Items:
${items.map(item => `- ${productMap[item.product.toString()] || 'Unknown Product'}: ${item.quantity} unit(s)`).join('\n')}

`;
    }

    // Add custom coils to the email
    if (customItems && customItems.length > 0) {
      emailContent += `
Custom Coils:
${customItems.map((item, index) => `
Custom Coil #${index + 1} (Quantity: ${item.quantity})
- Coil Type: ${item.coilType || 'Not specified'}
- Dimensions: ${item.height || 'N/A'} × ${item.length || 'N/A'}
- Rows: ${item.rows || 'N/A'}
- FPI: ${item.fpi || 'N/A'}
- Endplate Type: ${item.endplateType || 'N/A'}
- Circuit Type: ${item.circuitType || 'N/A'}
- Number of Circuits: ${item.numberOfCircuits || 'N/A'}
- Header Size: ${item.headerSize || 'N/A'}
- Tube Type: ${item.tubeType || 'N/A'}
- Fin Type: ${item.finType || 'N/A'}
- Distributor Holes: ${item.distributorHolesDontKnow ? 'Not specified' : (item.distributorHoles || 'N/A')}
- Inlet Connection: ${item.inletConnectionDontKnow ? 'Not specified' : (item.inletConnection || 'N/A')}
`).join('\n')}
`;
    }

    emailContent += `
Regards,
${process.env.COMPANY_NAME}
`;

    // Send email with product details
    try {
      const mailOptions = {
        from: process.env.SENDER_MAIL,
        to: process.env.ADMIN_MAIL,
        subject: `New order placed: ${orderId}`,
        text: emailContent,
      };
      await sendEmail(mailOptions);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Failed to send email" });
    }

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