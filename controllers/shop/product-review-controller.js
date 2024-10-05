const Order = require("../../models/Orders");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addReview = async (req, res) => {
  try {
    const { userId, userName, productId, reviewMessage, reviewValue } =
      req.body;

    // if user has bought the product or not
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      // orderStatus: "confirmed" || "delieverd"
    });

    if (!order) {
      return res.status(400).json({
        success: false,
        message: "You need to purchase product to review it.",
      });
    }

    // if user already share its review
    const checkExistingReview = await ProductReview.findOne({
      productId,
      userId,
    });

    if (checkExistingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this product!",
      });
    }

    // create new review
    const newReview = await ProductReview({
      userId,
      userName,
      productId,
      reviewMessage,
      reviewValue,
    });
    await newReview.save();

    // finding average review of the product
    const reviews = await ProductReview.find({ productId });
    const totalReviewLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewLength;

    await Product.findByIdAndUpdate(productId, { averageReview });

    res.status(200).json({
      success: true,
      data: newReview,
    });
    
  } catch (err) {
    console.log("Error in adding the review", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await ProductReview.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (err) {
    console.log("Error in getting the reviews", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { addReview, getReviews };
