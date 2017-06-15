const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let threadSchema = new mongoose.Schema({
  title: {type: String, require: true},
  description: {type: String, required: true},
  lastAnswer: {type: Date, default: Date.now()},
  author: {type: ObjectId, required: true, ref: 'User'},
  views: {type: Number, default: 0},
  likes: [{type: ObjectId, ref: 'User'}],
  category: {type: ObjectId, ref: 'Category'}
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread

