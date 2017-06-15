const mongoose = require('mongoose')

let carSchema = new mongoose.Schema({
  make: {type: String, required: true},
  model: {type: String, required: true},
  year: {type: String, required: true},
  pricePerDay: {type: Number, required: true},
  power: {type: Number},
  createOn: {type: Date, default: Date.now()},
  image: {type: String, required: true},
  isRented: {type: Boolean, default: false}
})

let Car = mongoose.model('Car', carSchema)

module.exports = Car
