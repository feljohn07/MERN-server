const mongoose = require("mongoose")
const Schema = mongoose.Schema

let purchaseSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: "product",
        // required: true
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "supplier",
        // required: true
    },
    purchase_date: {
        type: Date,
        required: true
    },
    purchase_price: {
        type: Number,
        required: true
    },
    purchase_quantity: {
        type: Number,
        required: true
    }
}, { timestamps: true })

// PURCHASE
// product_id
// supplier_id
// purchase_price
// quantity
// timestamp

module.exports = mongoose.model("purchase", purchaseSchema)
