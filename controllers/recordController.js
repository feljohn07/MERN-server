const Record = require("../models/recordModel")
const { default: mongoose } = require("mongoose");


// All records
const getRecords = async (req, res) => {

    try {
        const record = await Record.find({})
        res.status(200).json(record)
    } catch (error) {
        res.status(400).json({error: error.message})
    }

}


// Create a record
const createRecord = async (req, res) => {
    const {name, position, level} = req.body

    try {
        const record = await Record.create({name, position, level})
        res.status(200).json(record)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}


// Retrieve a record
const getRecord = async (req, res) => {

    const { id } = req.params 

    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: "No record Found"})
    }

    const record = await Record.findById(id)

    if(!record) return

    res.status(200).json(record)

}


// Update a record
const updateRecord = async (req, res) => {
  
    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const record = await Record.findOneAndUpdate({_id: id}, {
      ...req.body
    })
  
    if(!record) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(record)
  
}


// Delete a record
const deleteRecord = async (req, res) => {
    const { id } = req.params
  
    // validate ID first before using it to find a record
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({error: "No record Found"})
    }
  
    const record = await Record.findByIdAndDelete({_id: id})
  
    if(!record) return res.status(404).json({error: "No record Found"})
  
    res.status(200).json(record)
}


module.exports = {
    getRecords,
    createRecord,
    getRecord,
    updateRecord,
    deleteRecord,
}