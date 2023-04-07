const mongoose = require("mongoose")
const Schema = mongoose.Schema

let supplierSchema = new Schema({

    supplier_name: {
        type: String,
        required: true
    },
    supplier_address: {
        type: String,
        required: true
    },

}, { timestamps: true})

// SUPPLIER
// supplier_name
// supplier_address
// timestamp

module.exports = mongoose.model("supplier", supplierSchema)