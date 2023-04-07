const Product = require("../models/productModel")
const Purchase = require("../models/purchaseModel")
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

module.exports = {
    inventoryStatus,
}