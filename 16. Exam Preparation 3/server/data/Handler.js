const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let handlerSchema = new mongoose.Schema({
  user: [{type: ObjectId, ref: 'User'}],
  image: [{type: ObjectId, ref: 'Image'}]
})

let Handler = mongoose.model('Handler', handlerSchema)

module.exports = Handler
