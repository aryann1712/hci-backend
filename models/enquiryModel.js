const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquiryItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    mappedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // optional
});

const enquirySchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        enquiryId: { type: String, unique: true }, // e.g. "ORD-xxx"
        status: { type: String, default: "Requested" }, // "Enquiry", "Ordered", etc.
        items: [enquiryItemSchema], // array of subdocs
    },
    { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
