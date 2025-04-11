const mongoose = require("mongoose");
const { Schema } = mongoose;

const enquiryItemSchema = new Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: { type: Number, default: 1 },
    price: { type: Number, default: 0 },
    mappedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // optional
});



const customCoilItemSchema = new Schema({
    coilType: { type: String },
    height: { type: String },
    length: { type: String },
    rows: { type: String },
    fpi: { type: String },
    endplateType: { type: String },
    circuitType: { type: String },
    numberOfCircuits: { type: String },
    headerSize: { type: String },
    tubeType: { type: String },
    pipeType: { type: String },
    finType: { type: String },
    distributorHoles: { type: String },
    distributorHolesDontKnow: { type: Boolean, default: false },
    inletConnection: { type: String },
    inletConnectionDontKnow: { type: Boolean, default: false },
    quantity: { type: Number, default: 1 },
  });

  
const enquirySchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        enquiryId: { type: String, unique: true }, // e.g. "ORD-xxx"
        status: { type: String, default: "Requested" }, // "Enquiry", "Ordered", etc.
        items: [enquiryItemSchema], // array of subdocs
        customItems: [customCoilItemSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Enquiry", enquirySchema);
