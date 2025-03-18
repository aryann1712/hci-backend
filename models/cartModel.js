const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartItemSchema = new Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
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
  finType: { type: String },
  distributorHoles: { type: String },
  distributorHolesDontKnow: { type: Boolean, default: false },
  inletConnection: { type: String },
  inletConnectionDontKnow: { type: Boolean, default: false },
  quantity: { type: Number, default: 1 },
});

const cartSchema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [cartItemSchema],
    customItems: [customCoilItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
