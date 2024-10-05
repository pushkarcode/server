const { imageUploadUtils } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtils(url);
    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log("Error in image uploading controller - ", error);
    res.json({
      success: false,
      message: error,
    });
  }
};

// add product
const addProduct = async(req, res) => {

  const {title, description, price, salePrice, totalStock, category, brand, image} = req.body;
  try{

    const newProduct = new Product({
      image, title, description, price, salePrice, totalStock, category, brand
    })
    await newProduct.save();
    res.status(200).json({
      success: true,
      data: newProduct,
      message: "Product Added Successful",
    });


  }catch(error){
    console.log("Error in adding the product - ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }

}

// fetch all products
const fetchAllProducts = async(req, res) => {

  try{
    const allProducts = await Product.find({});

    res.status(200).json({
      success: true,
      data: allProducts,
      message: "Fetched Products Successful",
    });

  }catch(error){
    console.log("Error in fetching the products - ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }

}

// delete product
const deleteProduct = async(req, res) => {

  const {id} = req.params;
  try{
    const findProduct = await Product.findByIdAndDelete(id)
    if(!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product Deleted Successful",
    });

  }catch(error){
    console.log("Error in deleting the product - ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }

}

// edit product
const editProduct = async(req, res) => {
  const {id} = req.params;
  const {title, description, price, salePrice, totalStock, category, brand, image} = req.body;
  try{
    let findProduct = await Product.findById(id);
    if(!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product does not exist",
      });
    }

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === '' ? 0 : price
    findProduct.salePrice = salePrice === '' ? 0 : salePrice
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
      message: "Product Edited Successful",
    });
  }catch(error){
    console.log("Error in editing the product - ", error);
    res.status(500).json({
      success: false,
      message: error,
    });
  }

}

module.exports = {handleImageUpload, addProduct, fetchAllProducts, deleteProduct, editProduct};