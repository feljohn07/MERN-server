const Supplier = require("../models/supplierModel")
const { default: mongoose } = require("mongoose")

// All supplier
const getSuppliers = async (req, res) => {

    let limit = req.query.limit || 10
    let page = req.query.page || 0
    let query = req.query.query || ''

    console.log({"Limit": limit, "Query": query, "Page":page})

    try {

        const supplier = await (

            Supplier.find({
                        $or: [
                            { supplier_name: { $regex: '.*' + query + '.*', '$options' : 'i' } },
                            { supplier_address: { $regex: '.*' + query + '.*', '$options' : 'i' } },
                        ],
                    },  
                        {
                            "supplier_name": 1,
                            "supplier_address": 1,
                            "createdAt": 1,
                        }
                    )
                    .sort( { _id: -1 } )
                    .skip(page * limit)
                    .limit(limit)
        )

        // Total Rows based on find method
        let totalRows = await Supplier.find({
                $or: [
                    { supplier_name: { $regex: '.*' + query + '.*' } },
                    { supplier_address: { $regex: '.*' + query + '.*' } },
                ],
            }
        ).countDocuments()

        // Total Rows of the document
        let numOfRecords = await Supplier.find().countDocuments()

        // console.log( "Rows: ", supplier )
        // console.log( "Row Count: ", count )

        res.status(200).json({ suppliers: supplier, numOfPages: Math.ceil(totalRows / limit), numOfRecords: numOfRecords})
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Create a supplier
const createSupplier = async (req, res) => {

    const {supplier_name, supplier_address} = req.body

    try {
        const supplier = await Supplier.create({supplier_name, supplier_address})
        res.status(200).json(supplier)
    } catch (error) {
        res.status(400).json({error: error})
    }

}


// Retrieve a supplier
const getSupplier = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const supplier = await Supplier.findById(id)

    if(!supplier) return

    res.status(200).json(supplier)

}


// Update a Supplier
const updateSupplier = async (req, res) => {
  
    const { id } = req.params
    
    console.log(id)
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const supplier = await Supplier.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if(!supplier) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(supplier)
  
}


// Delete a Supplier
const deleteSupplier = async (req, res) => {

    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const supplier = await Supplier.findByIdAndDelete({_id: id})
  
    if(!supplier) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(supplier)

}

module.exports = {
    getSuppliers,
    createSupplier,
    getSupplier,
    updateSupplier,
    deleteSupplier,

}