const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderItemSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  mappedProduct: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, // optional
});

const orderSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: String, unique: true }, // e.g. "ORD-xxx"
    status: { type: String, default: "Enquiry" }, // "Enquiry", "Ordered", etc.
    items: [orderItemSchema], // array of subdocs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
