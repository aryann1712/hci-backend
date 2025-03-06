// controllers/orderController/getOrderById.js
const Enquiry = require("../../models/enquiryModel");
const { getObjectURL } = require("../../utils/s3Bucket");



const getEnquiryByUserId = async (req, res, next) => {
  try {
    const { id } = req.params;

    // // Ensure the user is admin or the owner
    // if (req.user.role !== "admin" && req.user.userId !== order.user.toString()) {
    //   return res.status(403).json({ error: "Access denied." });
    // }

    const enquiries = await Enquiry.find({ user: id })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-passwordHash"
      })  // populate user
      .populate("items.product");       // populate product

    if (enquiries.length < 1) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Update each product's image URL with S3 URL
    const updatedEnquiries = await Promise.all(enquiries.map(async enquiry => {
      const updatedItems = await Promise.all(enquiry.items.map(async item => {
        if (item.product.images && item.product.images.length > 0) {
          item.product.images = await Promise.all(item.product.images.map(async image => {
            return await getObjectURL(image);
          }));
        }
        return item;
      }));

      return { ...enquiry.toObject(), items: updatedItems };
    }));

    // res.status(200).json({ success: true, data: enquiries });
    res.status(200).json({ success: true, data: updatedEnquiries });
  } catch (error) {
    next(error);
  }
};

module.exports = getEnquiryByUserId;
