const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const cookieParser = require("cookie-parser");
const authRouter = require("./routes/Auth/auth-routes");
const adminProductRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductRouter = require("./routes/shop/product-routes");
const ProductReviewRouter = require("./routes/shop/review-routes");
const cartRouter = require("./routes/shop/cart-routes");
const addressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const searchRouter = require("./routes/shop/search-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Mongoose is connected"))
  .catch((err) => console.error("Error in connecting with mongoose - ", err));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_BASE_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Authorization",
      "Content-Type",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// auth routes
app.use("/api/auth", authRouter);

app.use("/api/admin/products", adminProductRouter);
app.use("/api/admin/order", adminOrderRouter);

app.use("/api/shop/products", shopProductRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/shop/cart", cartRouter);
app.use("/api/shop/address", addressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/review", ProductReviewRouter);
app.use("/api/shop/search", searchRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is started on PORT ${PORT}`));
