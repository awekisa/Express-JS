const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

let articleSchema = new mongoose.Schema({
  title: {type: String, required: true},
  author: {type: ObjectId, required: true, ref: 'User'},
  description: {type: String, required: true},
  content: {type: String, required: true},
  date: {type: Date, default: Date.now()}
})

let Article = mongoose.model('Article', articleSchema)

module.exports = Article
