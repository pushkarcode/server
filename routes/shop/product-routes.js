
const express = require('express');
const { getFilteredProduct, getProductDetails } = require('../../controllers/shop/product-controller');
const router = express.Router();

router.get("/get", getFilteredProduct);
router.get("/getproductdetails/:id", getProductDetails);

module.exports = router;