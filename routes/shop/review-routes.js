const express = require('express');
const { addReview, getReviews } = require('../../controllers/shop/product-review-controller');
const router = express.Router();

router.post("/add", addReview);
router.get("/:productId", getReviews);

module.exports = router;