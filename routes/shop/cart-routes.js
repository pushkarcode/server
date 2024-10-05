
const express = require('express');
const { addToCart, deleteItemFromCart, fetchItemsFromCart, changeCartItemQuantity } = require('../../controllers/shop/cart-controller');
const router = express.Router();

router.post("/add", addToCart);
router.delete("/delete/:userId/:productId", deleteItemFromCart);
router.get("/get/:userId", fetchItemsFromCart);
router.put("/update-cart", changeCartItemQuantity);

module.exports = router;