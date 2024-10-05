const Product = require("../../models/Product");

const searchProducts = async (req, res) => {

    try{
        const {keyword} = req.params;
        if(!keyword || typeof keyword !== 'string'){
            res.status(400).json({
                success: false,
                message: "Keyword is required and must be the string"
            })
        }

        const regEx = new RegExp(keyword, 'i');
        const createSearchQuery = {
            $or: [
                {title: regEx},
                {description: regEx},
                {category: regEx},
                {brand: regEx},
            ]
        }

        const searchResults = await Product.find(createSearchQuery);
        res.status(200).json({
            success: true,
            data: searchResults
        })
    }
    catch(err) {
        console.log("Error in searching the product");
        res.status(500).json({
            success: false,
            message: err.message
        })
    }

}

module.exports = {searchProducts}