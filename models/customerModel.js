const mongoose = require("mongoose")
const Schema = mongoose.Schema

let customerSchema = new Schema({

    customer_name: {
        type: String,
        required: true
    },
    customer_address: {
        type: String,
        required: true
    },

}, { timestamps: true })

// CUSTOMER
// customer_name
// customer_address
// timestamp

module.exports = mongoose.model("customer", customerSchema)