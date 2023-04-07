const Customer = require("../models/customerModel")
const { default: mongoose } = require("mongoose")

// All customer
const getCustomers = async (req, res) => {

    let limit = req.query.limit || 10
    let page = req.query.page || 0
    let query = req.query.query || ''

    console.log({"Limit": limit, "Query": query, "Page":page})

    try {

        const customer = await (

            Customer.find({
                        $or: [
                            { customer_name: { $regex: '.*' + query + '.*', '$options' : 'i' } },
                            { customer_address: { $regex: '.*' + query + '.*', '$options' : 'i' } },
                        ],
                    },  
                        {
                            "customer_name": 1,
                            "customer_address": 1,
                            "createdAt": 1,
                        }
                    )
                    .sort( { _id: -1 } )
                    .skip(page * limit)
                    .limit(limit)
        )

        // Total Rows based on find method
        let totalRows = await Customer.find({
                $or: [
                    { customer_name: { $regex: '.*' + query + '.*' } },
                    { customer_address: { $regex: '.*' + query + '.*' } },
                ],
            }
        ).countDocuments()

        // Total Rows of the document
        let numOfRecords = await Customer.find().countDocuments()

        // console.log( "Rows: ", customer )
        // console.log( "Row Count: ", count )

        res.status(200).json({ customers: customer, numOfPages: Math.ceil(totalRows / limit), numOfRecords: numOfRecords})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Create a customer
const createCustomer = async (req, res) => {

    const {customer_name, customer_address} = req.body

    try {
        const customer = await Customer.create({customer_name, customer_address})
        res.status(200).json(customer)
    } catch (error) {
        res.status(400).json({error: error})
    }

}


// Retrieve a customer
const getCustomer = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const customer = await Customer.findById(id)

    if(!customer) return

    res.status(200).json(customer)

}


// Update a Customer
const updateCustomer = async (req, res) => {
  
    const { id } = req.params
    
    console.log(id)
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }

    try {
        const customer = await Customer.findOneAndUpdate({_id: id}, {
            ...req.body
        })
    
        if(!customer) return res.status(404).json({error: "No record Found"})
        res.status(200).json(customer)

    } catch (error) {
        res.status(400).json({error: error})
    }
  
}


// Delete a Customer
const deleteCustomer = async (req, res) => {

    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const customer = await Customer.findByIdAndDelete({_id: id})
  
    if(!customer) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(customer)

}

module.exports = {
    getCustomers,
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,

}