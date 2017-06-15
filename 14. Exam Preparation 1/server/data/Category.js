const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let categorySchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  threads: [{type: ObjectId, ref: 'Thread'}]
})

let Category = mongoose.model('Category', categorySchema)

module.exports = Category

