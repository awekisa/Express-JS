const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let postSchema = new mongoose.Schema({
  text: {type: String, required: true},
  date: {type: Date, default: Date.now()},
  author: {type: ObjectId, required: true, ref: 'User'},
  thread: {type: ObjectId, required: true, ref: 'Thread'}
})

let Post = mongoose.model('Post', postSchema)

module.exports = Post

