import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import { swaggerUi, specs, swaggerDocument } from "./config/swaggerConfig.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

dotenv.config();

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
app.use("/api/enquire", enquiryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.json({ message: "MongoDB E-commerce API is running..." });
});

app.use(errorHandler);

app.listen(port, () => {
    let date_ob = new Date();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    console.log(`server is running in port ${port}// time  ->  ${hours}:${minutes}:${seconds}`);
});


