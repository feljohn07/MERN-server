const mongoose = require("mongoose")
const Schema = mongoose.Schema

let orderSchema =  new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "product"
    },
    customer: {
        type: Schema.Types.ObjectId,
        ref: "customer"
    },
    order_price: {
        type: Number,
        required: true
    },
    order_quantity: {
        type: Number,
        required: true
    },
    order_date: {
        type: Date,
        required: true
    }
}, { timestamps: true })

// ORDER
// product
// customer
// retail_price
// order_quantity
// timestamp

module.exports = mongoose.model("order", orderSchema)
