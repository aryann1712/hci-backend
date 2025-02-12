// models/productModel.js
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    sku: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { tableName: "products", timestamps: true }
);

module.exports = Product;
