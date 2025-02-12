// config/db.js
require("dotenv").config();
const { Sequelize } = require("sequelize");

// e.g., MySQL connection
const sequelize = new Sequelize(
  process.env.DB_NAME,      // e.g. "ecomDB"
  process.env.DB_USER,      // e.g. "root"
  process.env.DB_PASS,      // e.g. "password123"
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: true,         // set to console.log if you want SQL logs
  }
);

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Connected to MySQL database successfully!");

    // If you want Sequelize to auto-create tables (not recommended for production):
    // await sequelize.sync({ alter: true }); 
    // console.log("All models synced!");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectDB };
