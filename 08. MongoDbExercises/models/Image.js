const mongoose = require('mongoose')

let imagesSchema = mongoose.Schema({
  url: {type: mongoose.Schema.Types.String, require: true, unique: true},
  description: {type: mongoose.Schema.Types.String, require: true},
  date: {type: mongoose.Schema.Types.Date, default: Date.now()},
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Tag', default: []}]
})

let Image = mongoose.model('Image', imagesSchema)

module.exports = Image
