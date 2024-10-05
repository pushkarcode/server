const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// add item to cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Data not sufficient to add item to cart",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Product does not found",
      });
    }

    let cart = await Cart.findOne({userId});
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[findCurrentProductIndex].quantity += quantity;
    }

    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
      message: "Item added to cart successfully",
    });
  } catch (err) {
    console.log("Error in adding the item to cart", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// fetch product fronm card
const fetchItemsFromCart = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "UserID does not present",
      });
    }
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    // finding valid cart items (if admin deleted the item and it is present in your cart but not in database so remove from cart items)
    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // populating the cart items
    const populatingItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populatingItems,
      },
    });
  } catch (err) {
    console.log("Error in fetching the item from cart", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// delete cart item
const deleteItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    // console.log(userId, productId);
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId._id.toString() != productId
    );
    await cart.save();

    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (err) {
    console.log("Error in deleting the item from cart", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// change quantity= items
const changeCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    if (!userId || !productId || quantity<=0) {
      return res.status(400).json({
        success: false,
        message: "Invalid data providede!",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found!",
      });
    } 
    const findCurrentProductIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (findCurrentProductIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Cart item not present !",
      });
    }

    cart.items[findCurrentProductIndex].quantity = quantity;
    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    const populateCartItems = cart.items.map((item) => ({
      productId: item.productId ? item.productId._id : null,
      image: item.productId ? item.productId.image : null,
      title: item.productId ? item.productId.title : "Product not found",
      price: item.productId ? item.productId.price : null,
      salePrice: item.productId ? item.productId.salePrice : null,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      data: {
        ...cart._doc,
        items: populateCartItems,
      },
    });
  } catch (err) {
    console.log("Error in changing the quantity of item", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addToCart,
  fetchItemsFromCart,
  deleteItemFromCart,
  changeCartItemQuantity,
};
