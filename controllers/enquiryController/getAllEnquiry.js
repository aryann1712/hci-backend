// controllers/orderController/getAllOrders.js
const Enquiry = require("../../models/enquiryModel");
const { getObjectPublicURL } = require("../../utils/s3Bucket");

const getAllEnquiry = async (req, res, next) => {
    try {
        // Fetch enquiries with populated product data including images
        const enquiries = await Enquiry.find({})
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "name email companyName gstNumber address"
            })
            .populate({
                path: "items.product",
                select: "name description sku images"
            })
            .lean();

        if (!enquiries || enquiries.length === 0) {
            return res.status(200).json({ success: true, data: [] });
        }

        // Transform the data to ensure all fields are properly structured
        const formattedEnquiries = await Promise.all(enquiries.map(async enquiry => {
            // Process items with images
            const processedItems = await Promise.all((enquiry.items || []).map(async item => {
                let imageUrl = '/placeholder-product.png'; // Default placeholder image
                
                // Add null check for product and images
                const images = item.product?.images || [];
                
                if (images.length > 0) {
                    try {
                        // Get the first image URL from S3
                        imageUrl = await getObjectPublicURL(images[0]);
                    } catch (error) {
                        console.error('Error getting image URL:', error);
                        // Keep the default placeholder if there's an error
                    }
                }

                return {
                    product: {
                        _id: item.product?._id || '',
                        name: item.product?.name || 'N/A',
                        description: item.product?.description || 'N/A',
                        sku: item.product?.sku || 'N/A',
                        imageUrl: imageUrl // Add the processed image URL
                    },
                    quantity: item.quantity || 0
                };
            }));

            return {
                _id: enquiry._id,
                enquiryId: enquiry.enquiryId,
                status: enquiry.status,
                createdAt: enquiry.createdAt,
                updatedAt: enquiry.updatedAt,
                user: {
                    _id: enquiry.user?._id || '',
                    name: enquiry.user?.name || 'N/A',
                    email: enquiry.user?.email || 'N/A',
                    companyName: enquiry.user?.companyName || 'N/A',
                    gstNumber: enquiry.user?.gstNumber || 'N/A',
                    address: enquiry.user?.address || 'N/A'
                },
                items: processedItems,
                customItems: (enquiry.customItems || []).map(item => ({
                    coilType: item.coilType || 'N/A',
                    height: item.height || 'N/A',
                    length: item.length || 'N/A',
                    rows: item.rows || 'N/A',
                    fpi: item.fpi || 'N/A',
                    endplateType: item.endplateType || 'N/A',
                    circuitType: item.circuitType || 'N/A',
                    numberOfCircuits: item.numberOfCircuits || 'N/A',
                    headerSize: item.headerSize || 'N/A',
                    tubeType: item.tubeType || 'N/A',
                    finType: item.finType || 'N/A',
                    distributorHoles: item.distributorHoles || 'N/A',
                    distributorHolesDontKnow: item.distributorHolesDontKnow || false,
                    inletConnection: item.inletConnection || 'N/A',
                    inletConnectionDontKnow: item.inletConnectionDontKnow || false,
                    quantity: item.quantity || 0
                }))
            };
        }));

        res.status(200).json({ success: true, data: formattedEnquiries });
    } catch (error) {
        console.error('Error in getAllEnquiry:', error);
        next(error);
    }
};

module.exports = getAllEnquiry;
