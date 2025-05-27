const Enquiry = require("../../models/enquiryModel");
const mongoose = require("mongoose");

const updateEnquiryStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ["Requested", "Processing", "Completed", "Cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid enquiry ID" });
        }

        // Find and update the enquiry
        const updatedEnquiry = await Enquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate({
            path: "user",
            select: "-passwordHash"
        }).populate("items.product");

        if (!updatedEnquiry) {
            return res.status(404).json({ error: "Enquiry not found" });
        }

        res.status(200).json({ success: true, data: updatedEnquiry });
    } catch (error) {
        next(error);
    }
};

module.exports = updateEnquiryStatus; 