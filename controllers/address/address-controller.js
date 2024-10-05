const Address = require("../../models/Address");
const User = require("../../models/User");

// add address
const addAddress = async (req, res) => {
  try {
    const { userId, address, city, pincode, phone, notes } = req.body;
    if (!address || !city || !pincode || !phone || !notes || !userId) {
      return res.status(400).json({
        success: false,
        message: "Incomplete data",
      });
    }

    const newAddress = new Address({
      userId,
      address,
      city,
      pincode,
      phone,
      notes,
    });
    await newAddress.save();
    res.status(200).json({
      success: true,
      data: newAddress,
      message: "Address Added Successful",
    });
  } catch (err) {
    console.log("Error in adding the address", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// add address
const deleteAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Incomplete data",
      });
    }

    const response = await Address.findOneAndDelete({ _id: addressId, userId });
    if (!response) {
      return res.status(404).json({
        success: false,
        message: "Cannot delete this address",
      });
    }
    res.status(200).json({
      success: true,
      data: response,
      message: "Address deleted Successful",
    });
  } catch (err) {
    console.log("Error in deleting the address", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// edit address
const editAddress = async (req, res) => {
  try {
    const { userId, addressId } = req.params;
    const formData = req.body;

    if (!userId || !addressId) {
      return res.status(400).json({
        success: false,
        message: "Incomplete data",
      });
    }
    const newAddress = await Address.findOneAndUpdate(
      {
        _id: addressId,
        userId,
      },
      formData,
      { new: true }
    );

    if (!newAddress) {
      return res.status(400).json({
        success: false,
        message: "Address not found",
      });
    }

    res.status(200).json({
      success: true,
      data: newAddress,
      message: "Address Edited Successful",
    });
  } catch (err) {
    console.log("Error in editing the address", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// add address
const fetchAllAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      res.status(404).json({
        success: false,
        message: "Incomplete data",
      });
    }

    const addresses = await Address.find({userId});
    if (!addresses) {
      res.status(404).json({
        success: false,
        message: "Cannot find address",
      });
    }

    res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (err) {
    console.log("Error in fetching the addresses", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { addAddress, editAddress, fetchAllAddress, deleteAddress };
