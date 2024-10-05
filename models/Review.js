const mongoose = require("mongoose");

const ProductReview = new mongoose.Schema(
  {
    userId: String,
    userName: String,
    productId: String,
    reviewMessage: String,
    reviewValue: Number,
  },
  { timeStamp: true }
);

module.exports = mongoose.model("ProductReview", ProductReview)