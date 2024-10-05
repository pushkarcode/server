const paypal = require("../../helpers/paypal");
const Order = require("../../models/Orders");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
        cancel_url: `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
      },
      transactions: [
        {
          item_list: {
            items: cartItems.map((item) => ({
              name: item.title,
              sku: item.productId,
              price: item.price.toFixed(2),
              currency: "USD",
              quantity: item.quantity,
            })),
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "The payment transaction description.",
        },
      ],
    };

    paypal.payment.create(create_payment_json, async (error, paymentInfo) => {
      if (error) {
        console.log("Error in creating the payment", error);
        res.status(500).json({
          success: false,
          message: "Error while creating paypal payment",
        });
      } else {
        const newlyCreatedOrder = new Order({
          userId,
          cartId,
          cartItems,
          addressInfo,
          orderStatus,
          paymentMethod,
          paymentStatus,
          totalAmount,
          orderDate,
          orderUpdateDate,
          paymentId,
          payerId,
        });
        await newlyCreatedOrder.save();

        const approvalURL = paymentInfo.links.find(link => link.rel === 'approval_url').href;
        res.status(200).json({
          success: true,
          approvalURL,
          orderId: newlyCreatedOrder._id,
        })
      }
    });

  } catch (err) {
    console.log("Error in creating the order", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const capturePayment = async (req, res) => {
  try {

    const {orderId, paymentId, payerId} = req.body;

    let order = await Order.findById(orderId);
    if(!order) {
      res.status(400).json({
        success: false,
        message: "Order not found"
      })
    }

    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.paymentId = paymentId;
    order.payerId = payerId;

    for(let item of order.cartItems) {
      let product = await Product.findById(item.productId);
      if(!product) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock form this product ${product?.title}`
        })
      }

      product.totalStock -= item.quantity;
      await product.save();
    }

    // console.log(order, 'order')
    const getCartId = order?.cartId;
    await Cart.findByIdAndDelete(getCartId)

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });

  } catch (err) {
    console.log("Error in capturing the payment", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllOrdersOfUser = async(req, res) => {
  try{
    const {userId} = req.params;
    const orders = await Order.find({userId});
    if(!orders.length) {
      res.status(400).json({
        success: false,
        message: "Orders not found",
      })
    }

    res.status(200).json({
      success: true,
      data: orders,
    })
  }
  catch(err) {
    console.log('error in getting user orders', err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

const getOrderDetails = async(req, res) => {
  try{
    const {id} = req.params;
    // console.log(id, '-id');
    const order = await Order.findById(id);
    if(!order) {
      res.status(400).json({
        success: false,
        message: "Order details not found",
      })
    }

    res.status(200).json({
      success: true,
      data: order,
    })
  }
  catch(err) {
    console.log('error in getting order details', err)
    res.status(500).json({
      success: false,
      message: err.message,
    })
  }
}

module.exports = { createOrder, capturePayment, getAllOrdersOfUser, getOrderDetails };
