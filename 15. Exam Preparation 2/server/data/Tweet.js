const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let tweetSchema = new mongoose.Schema({
  message: {type: String, required: true, maxlength: 140},
  date: {type: Date, default: Date.now},
  author: {type: ObjectId, required: true, ref: 'User'},
  tags: [{type: String}],
  likes: [{type: ObjectId, ref: 'User'}],
  views: {type: Number, default: 0}
})

let Tweet = mongoose.model('Tweet', tweetSchema)

module.exports = Tweet

