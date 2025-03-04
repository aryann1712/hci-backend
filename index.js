const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const { swaggerUi, specs, swaggerDocument } = require("./config/swaggerConfig"); // Import Swagger config



const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const cartRoutes = require("./routes/cartRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");



const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());


connectDB();

// routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({ message: "MongoDB E-commerce API is running..." });
});





app.use(errorHandler);

app.listen(port, () => {
    let date_ob = new Date();
    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    console.log(`server is running in port ${port}// time  ->  ${hours}:${minutes}:${seconds}`);
});


