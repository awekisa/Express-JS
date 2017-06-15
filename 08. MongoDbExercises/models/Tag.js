const mongoose = require('mongoose')

let tagSchema = mongoose.Schema({
  name: {type: mongoose.Schema.Types.String, required: true},
  date: {type: mongoose.Schema.Types.Date, default: Date.now()},
  images: [{type: mongoose.Schema.Types.ObjectId, ref: 'Image', default: []}]
})

let Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
