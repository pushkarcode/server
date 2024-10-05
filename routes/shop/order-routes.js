
const express = require('express');
const router = express.Router();
const { createOrder, capturePayment, getAllOrdersOfUser, getOrderDetails }  = require('../../controllers/payment/order-controllers')

router.post("/create", createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersOfUser);
router.get("/details/:id", getOrderDetails);


module.exports = router;