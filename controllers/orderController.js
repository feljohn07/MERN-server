const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const { default: mongoose } = require("mongoose")

// All order
const getOrders = async (req, res) => {

    let limit = req.query.limit || 10
    let page = req.query.page || 0
    let query = req.query.query || ''
    let product_id = req.query.product_id || ''

    console.log({"Limit": limit, "Query": query, "Page":page})

    try {

        const orders = await (

            Order.find(product_id ? { product: product_id } : {})
                    .select({
                        "product": 1,
                        "customer": 1,
                        "order_price": 1,
                        "order_quantity": 1,
                        "order_date": 1,
                        "createdAt": 1,
                    })
                    .sort( { _id: -1 } )
                    .skip(page * limit)
                    .limit(limit)
                    .populate({
                        path: 'product customer',
                        select: 'product_name customer_name'
                    })
        )

        // Total Rows based on find method
        let totalRows = await Order.find(product_id ? { product: product_id } : {}).countDocuments()

        // Total Rows of the document
        let numOfRecords = await Order.find(product_id ? { product: product_id } : {}).countDocuments()

        console.log( "Rows: ", limit )
        console.log( "Row Count: ", totalRows )

        res.status(200).json({ orders: orders, numOfPages: Math.ceil(totalRows / limit), numOfRecords: numOfRecords})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Create a order
const createOrder = async (req, res) => {

    const {product, customer, order_date, order_price, order_quantity} = req.body

    try {
        const order = await Order.create({product, customer, order_date, order_price, order_quantity})

        // update product "quantity_on_hand" based on the quantity of order product
        // console.log(order)
        try {

            const old_quantity = await Product.findOne( order.product ).select({ "quantity_on_hand": 1 })

            console.log("old quantity: ", old_quantity)

            const filter = { _id: order.product }
            const update = { quantity_on_hand: (old_quantity.quantity_on_hand - order.order_quantity) }

            const product = await Product.findOneAndUpdate(filter, update, {
                new: true
            })

            console.log(product)

            res.status(200).json(order)


            // const filter = { _id: order.product }
            // const update = { quantity_on_hand: order.order_quantity }

            // const product = await Product.findOneAndUpdate(filter, update, {
            //     new: true
            // })

            // console.log(product)

            // res.status(200).json(order)

        }catch (error) {
            res.status(400).json({error: error})
        }
    } catch (error) {
        res.status(400).json({error: error})
    }

}


// Retrieve a order
const getOrder = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const order = await Order.findById(id)

    if(!order) return

    res.status(200).json(order)

}


// Update a Order
const updateOrder = async (req, res) => {
  
    const { id } = req.params
    
    console.log(id)
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const order = await Order.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if(!order) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(order)
  
}


// Delete a Order
const deleteOrder = async (req, res) => {

    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const order = await Order.findByIdAndDelete({_id: id})
  
    if(!order) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(order)

}

module.exports = {
    getOrders,
    createOrder,
    getOrder,
    updateOrder,
    deleteOrder,

}