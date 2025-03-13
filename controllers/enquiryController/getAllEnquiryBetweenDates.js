// controllers/orderController/getAllOrders.js
const Enquiry = require("../../models/enquiryModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");


const getAllEnquiryBetweenDates = async (req, res, next) => {
    try {

        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);

        // // confirm admin
        // if (req.user.role !== "admin") {
        //     return res.status(403).json({ error: "Admin only" });
        // }

        const enquiries = await Enquiry.find({
            createdAt: { $gte: startDate, $lte: endDate }
        }).sort({ createdAt: -1 })
            .populate("user", "phone email")  // populate user
            .populate("items.product");       // populate product

        if (enquiries.length < 1) {
            return res.status(404).json({ error: "No enquiry found." });
        }

        // Update each product's image URL with S3 URL
        const updatedEnquiries = await Promise.all(enquiries.map(async enquiry => {
            const updatedItems = await Promise.all(enquiry.items.map(async item => {
                if (item.product.images && item.product.images.length > 0) {
                    item.product.images = await Promise.all(item.product.images.map(async image => {
                        return await getObjectPublicURL(image);
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

module.exports = getAllEnquiryBetweenDates;