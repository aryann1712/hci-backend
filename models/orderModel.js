// models/orderModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./userModel");

const Order = sequelize.define(
  "Order",
  {
    orderId: {
      type: DataTypes.STRING,
      unique: true,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "Enquiry",
    },
    // items can be in a separate table or a JSON field. 
    // You might define an OrderItem model for a normalized design.
    items: {
      type: DataTypes.JSON, // or an association with OrderItems
    },
  },
  { tableName: "orders", timestamps: true }
);

// Example association: an order belongs to a user
Order.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Order, { foreignKey: "userId" });

module.exports = Order;
