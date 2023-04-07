const mongoose = require("mongoose")
const Schema = mongoose.Schema

let productSchema = new Schema({

    product_name: {
        type: String,
        required: true
    },
    minimum_quantity: {
        type: Number,
        required: true
    },
    retail_price: {
        type: Number,
        required: true,
        
    },
    quantity_on_hand: {
        type: Number,
        default: 0,
        required: true
    },
    purchases: [{
        type: Schema.Types.ObjectId,
        ref: "purchase"
    }],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: "order"
    }]

}, { timestamps: true });

// PRODUCT
// product_name
// minimum_quantity
// retail_price
// quantity_on_hand
// timestamp

module.exports = mongoose.model("product", productSchema)