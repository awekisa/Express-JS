const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let handlerSchema = new mongoose.Schema({
  user: {type: ObjectId, required: true, ref: 'User'},
  tweet: {type: ObjectId, required: true, ref: 'Tweet'}
})

let Handler = mongoose.model('Handler', handlerSchema)

module.exports = Handler
