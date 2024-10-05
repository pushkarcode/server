const Product = require("../../models/Product");

const getFilteredProduct = async (req, res) => {
  try {
    const { category = [], brand = [], sortBy = "price-lowtohigh" } = req.query;

    let filters = {};
    if (category.length) {
      filters.category = { $in: category.split(",") };
    }
    if (brand.length) {
      filters.brand = { $in: brand.split(",") };
    }

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh":
        sort = {
            effectivePrice: 1, // Ascending
          };
        break;
      case "price-hightolow":
        sort = {
            effectivePrice: -1, // Ascending
          };
        break;
      case "title-atoz":
        sort.title = 1;
        break;
      case "title-ztoa":
        sort.title = -1;
        break;
      default:
        sort = {
            effectivePrice: 1, // Ascending
          };
        break;
    }

    const products = await Product.aggregate([
      { $match: filters },
      {
        $addFields: {
          effectivePrice: {
            $cond: {
              if: { $gt: ["$salePrice", 0] },
              then: "$salePrice",
              else: "$price",
            },
          },
        },
      },
      {
        $sort: sort, // Sort based on either price or title
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Product was successfully filtered",
      data: products,
    });
  } catch (err) {
    console.log("Error in fetching shop products-", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getProductDetails = async(req, res) => {

  try{
    const {id} = req.params;
    const findProduct = await Product.findById(id);
    if(!findProduct) {
      return res.status(404).json({
        success: false,
        message: "Product does not found",
      });
    }

    // console.log(findProduct, "-product")
    res.status(200).json({
      success: true,
      data: findProduct
    })
  }catch(err){
    console.log("Error in getting product details", err);
    res.status(500).json({
      success: false,
      message: err
    })
  }

}

module.exports = { getFilteredProduct, getProductDetails };
