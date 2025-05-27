const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    categories: [{ type: String, required: true }],
    description: { type: String },
    images: [{ type: String }],
    price: { type: Number, default: 0 },
    show: { type: Boolean, default: true },
    sku: { type: String, unique: true },
    dimensions: {
      length: { type: Number, default: 0 },
      width: { type: Number, default: 0 },
      height: { type: Number, default: 0 }
    },
    sqmm: { type: Number, default: 0 }, // Surface area in square millimeters
    additionalFiles: [{ type: String }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
