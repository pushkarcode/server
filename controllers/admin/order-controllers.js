const Orders = require("../../models/Orders");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Orders.find();
    if (!orders.length) {
      res.status(400).json({
        success: false,
        message: "Orders not found",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    console.log("error in getting all orders", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id, '-id');
    const order = await Orders.findById(id);
    if (!order) {
      res.status(400).json({
        success: false,
        message: "Order details not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    console.log("error in getting order details", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // if (!id || !orderStatus) {
    //   res.status(400).json({
    //     success: false,
    //     message: "Incomplete Data to Update the order status",
    //   });
    // }

    const order = await Orders.findById(id);
    if (!order) {
      res.status(400).json({
        success: false,
        message: "Order details not found",
      });
    }

    await Orders.findByIdAndUpdate(id, {orderStatus});

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });

  } catch (err) {
    console.log("error in updating order status", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { getAllOrdersOfAllUsers, getOrderDetails, updateOrderStatus };
