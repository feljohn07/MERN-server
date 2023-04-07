const Purchase = require("../models/purchaseModel")
const Product = require("../models/productModel")
const { default: mongoose } = require("mongoose")

// All purchase
const getPurchases = async (req, res) => {

    let limit = req.query.limit || 10
    let page = req.query.page || 0
    let query = req.query.query || ''
    let product_id = req.query.product_id || ''

    console.log({"Limit": limit, "Query": query, "Page":page})

    try {

        const purchases = await (

            Purchase.find(product_id ? { product: product_id } : {})
                    .select({
                        "product": 1,
                        "supplier": 1,
                        "purchase_price": 1,
                        "purchase_quantity": 1,
                        "purchase_date": 1,
                        "createdAt": 1,
                    })
                    .sort( { _id: -1 } )
                    .skip(page * limit)
                    .limit(limit)
                    .populate({
                        path: 'product supplier',
                        select: 'product_name supplier_name'
                    })
        )

        // Total Rows based on find method
        let totalRows = await Purchase.find(product_id ? { product: product_id } : {}).countDocuments()

        // Total Rows of the document
        let numOfRecords = await Purchase.find(product_id ? { product: product_id } : {}).countDocuments()

        console.log( "Rows: ", limit )
        console.log( "Row Count: ", totalRows )

        res.status(200).json({ purchases: purchases, numOfPages: Math.ceil(totalRows / limit), numOfRecords: numOfRecords})

    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// Create a purchase
const createPurchase = async (req, res) => {

    const { product, supplier, purchase_date, purchase_price, purchase_quantity } = req.body

    try {
        const purchase = await Purchase.create({ product, supplier, purchase_date, purchase_price, purchase_quantity })

        // update product "quantity_on_hand" based on the quantity of purchased product
        console.log(purchase)
        try {

            const old_quantity = await Product.findOne( purchase.product ).select({ "quantity_on_hand": 1 })

            console.log("old quantity: ", old_quantity)

            const filter = { _id: purchase.product }
            const update = { quantity_on_hand: (purchase.purchase_quantity + old_quantity.quantity_on_hand) }

            const product = await Product.findOneAndUpdate(filter, update, {
                new: true
            })

            console.log(product)

            res.status(200).json(purchase)

        }catch (error) {
            res.status(400).json({error: error})
        }
        
    } catch (error) {
        res.status(400).json({error: error})
    }



}


// Retrieve a purchase
const getPurchase = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const purchase = await Purchase.findById(id)

    if(!purchase) return

    res.status(200).json(purchase)

}


// Update a Purchase
const updatePurchase = async (req, res) => {
  
    const { id } = req.params
    
    console.log(id)
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const purchase = await Purchase.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if(!purchase) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(purchase)
  
}


// Delete a Purchase
const deletePurchase = async (req, res) => {

    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const purchase = await Product.findByIdAndDelete({_id: id})
  
    if(!purchase) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(purchase)

}

const viewProductPurchase = async (req, res) => {

    const id = req.query.id || ''
    console.log("here", id)

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "Invalid ID"})
    }

    const purchases = await (

        Purchase.find({ product: id }).populate({
            path: 'supplier',
            select: 'supplier_name'
        })

    )
    
    return res.status(200).json(purchases)
}

module.exports = {
    getPurchases,
    createPurchase,
    getPurchase,
    updatePurchase,
    deletePurchase,
    viewProductPurchase,

}