const Product = require("../models/productModel")
const Purchase = require("../models/purchaseModel")
const Order = require("../models/orderModel")
const { default: mongoose } = require("mongoose")


// All product
const getProducts = async (req, res) => {

    let limit = req.query.limit || 10
    let page = req.query.page || 0
    let query = req.query.query || ''

    console.log({"Limit": limit, "Query": query, "Page":page})

    try {

        const products = await (

            Product.aggregate([
                
                {
                    $match: {
                        $or: [
                            { product_name: { $regex: '.*' + query + '.*', '$options' : 'i' } },
                        ],
                    },  
                },
                // First Stage
                {
                    $lookup: {
                        from: 'purchases',
                        localField: '_id',
                        foreignField: 'product',
                        as: 'purchases'
                    }
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'product',
                        as: 'orders'
                    }
                },
                // Second Stage
                {
                    $addFields:
                    {
                        total_purchases : { $sum: "$purchases.purchase_quantity" },
                        total_orders : { $sum: "$orders.order_quantity" }
                    }
                },

                { $sort : { _id: -1 } }
            ])

        )

        // Total Rows based on find method
        let totalRows = await Product.find({
                $or: [
                    { product_name: { $regex: '.*' + query + '.*' } },
                ],
            }
        ).countDocuments()

        // Total Rows of the document
        let numOfRecords = await Product.find().countDocuments()

        // console.log( "Rows: ", Product )
        // console.log( "Row Count: ", count )

        res.status(200).json({ products: products, numOfPages: Math.ceil(totalRows / limit), numOfRecords: numOfRecords})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// Create a product
const createProduct = async (req, res) => {

    const {product_name, minimum_quantity, retail_price, quantity_on_hand} = req.body

    try {
        const product = await Product.create({product_name, minimum_quantity, retail_price, quantity_on_hand})
        res.status(200).json(product)
    } catch (error) {
        res.status(400).json({error: error})
    }

}


// Retrieve a product
const getProduct = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const product = await Product.findById(id)

    if(!product) return

    res.status(200).json(product)

}


// Update a Product
const updateProduct = async (req, res) => {
  
    const { id } = req.params
    
    console.log(id)
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const product = await Product.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if(!product) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(product)
  
}


// Delete a Product
const deleteProduct = async (req, res) => {

    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const purchases = await Purchase.deleteMany({product: id})
    const orders = await Order.deleteMany({product: id})
  
    const product = await Product.findByIdAndDelete({_id: id})

  
    if(!product) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json([product, purchases, orders])

}

module.exports = {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,

}