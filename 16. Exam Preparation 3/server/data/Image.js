const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let imageSchema = new mongoose.Schema({
  image: {type: String, required: true},
  description: {type: String, required: true, maxlength: 500},
  tags: [{type: String}],
  author: {type: ObjectId, ref: 'User'},
  views: {type: Number, default: 0},
  likes: [{type: ObjectId, ref: 'User'}],
  date: {type: Date, default: Date.now}
})

let Image = mongoose.model('Image', imageSchema)

module.exports = Image
