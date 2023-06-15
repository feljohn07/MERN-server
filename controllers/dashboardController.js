const Product = require("../models/productModel")
const Purchase = require("../models/purchaseModel")
const Order = require("../models/orderModel")

const { default: mongoose } = require("mongoose")

// All product
const inventoryStatus = async (req, res) => {

    try {
        const products = await (
            Product.aggregate([
                {
                    $match: {
                        $or: [
                            { product_name: { $regex: '.*' + "" + '.*', '$options' : 'i' } },
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
                        inventory : { $sum: "$quantity_on_hand" }
                    }
                },
                {
                    $addFields:
                    {
                        inventory_value : { $multiply: ["$retail_price", "$quantity_on_hand"] }
                    }
                },
                {
                    $addFields:
                    {
                        total_purchases : { $sum: "$purchases.purchase_quantity" }
                    }
                },
                {
                    $addFields:
                    {
                        total_orders : { $sum: "$orders.order_quantity" }
                    }
                },
                {
                    $group: { 
                        _id: null, 
                        total_purchases: { $sum: "$total_purchases" }, 
                        total_orders: { $sum: "$total_orders" },
                        inventory: { $sum: "$inventory" },
                        inventory_value: { $sum: "$inventory_value" },
                        inventory_cost: { $sum: "$inventory_cost" },
                    }
                }
            ])
            // .sort( { _id: -1 } )

        )

        // Total Rows based on find method
        let totalProducts = await Product.find({}).countDocuments()


        res
        .status(200)
        .json({ 
            products: products,
            totalProducts: totalProducts
        })

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


const purchasesChart = async (req, res) => {
    try {
        // Set the start and end dates for the range around 2023
        const startDate = new Date('2022-12-01')
        const endDate = new Date('2023-12-31')

        // Fetch all purchase documents from the database
        const purchases = await Purchase.find({
            purchase_date: { $gte: startDate, $lte: endDate }
        }) 
    
        // Create an object to store the monthly total purchases
        const monthlyTotals = {}
    
        // Iterate through the purchases and calculate monthly totals
        purchases.forEach(purchase => {
            const purchaseDate = purchase.purchase_date
            const monthKey = `${purchaseDate.getFullYear()}-${purchaseDate.getMonth() + 1}`
    
            // Initialize the monthly total if it doesn't exist
            if (!monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] = 0
            }
    
            // Calculate the purchase quantity total for the item
            const purchaseTotal = purchase.purchase_quantity
    
            // Add the purchase total to the monthly total
            monthlyTotals[monthKey] += purchaseTotal
        })

        res
        .status(200)
        .json(monthlyTotals)

    } catch (error) {

        console.error(error)

        res
        .status(400)
        .json(error)
    }
}

const ordersChart = async (req, res) => {
    try {
        // Set the start and end dates for the range around 2023
        const startDate = new Date('2022-12-01')
        const endDate = new Date('2023-12-31')

        // Fetch all order documents from the database
        const orders = await Order.find({
            order_date: { $gte: startDate, $lte: endDate }
        }) 
    
        // Create an object to store the monthly total orders
        const monthlyTotals = {}
    
        // Iterate through the orders and calculate monthly totals
        orders.forEach(order => {
            const orderDate = order.order_date
            const monthKey = `${orderDate.getFullYear()}-${orderDate.getMonth() + 1}`
    
            // Initialize the monthly total if it doesn't exist
            if (!monthlyTotals[monthKey]) {
                monthlyTotals[monthKey] = 0
            }
    
            // Calculate the order quantity total for the item
            const orderTotal = order.order_quantity
    
            // Add the order total to the monthly total
            monthlyTotals[monthKey] += orderTotal
        })

        res
        .status(200)
        .json(monthlyTotals)

    } catch (error) {

        console.error(error)

        res
        .status(400)
        .json(error)
    }
}

module.exports = {
    inventoryStatus,
    purchasesChart,
    ordersChart,
}