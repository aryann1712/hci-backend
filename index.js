const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const {connectDB} = require("./config/db")



const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");



const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());


connectDB();

// Setup routes
app.use("/api/users", userRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);


app.get("/", (req, res) => {
    res.json("www.google.com");
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
    
console.log(`server is running in port ${port}// time  ->  ${hours} - ${minutes} - ${seconds}`);
});


