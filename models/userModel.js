const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true,},
    phone: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    gstNumber: { type: String },
    address: { type: String },
    companyName: { type: String },
    role: { type: String, default: "user" }, // "admin" or "user"
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
